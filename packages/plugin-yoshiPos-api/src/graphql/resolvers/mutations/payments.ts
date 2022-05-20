import { Orders } from '../../../models/Orders';
import { QPayInvoices } from '../../../models/QPayInvoices';
import { IContext } from '../../types';
import {
  fetchQPayToken,
  requestQPayInvoice,
  fetchInvoicePayment,
  requestInvoiceDeletion
} from '../../utils/qpayUtils';
import { checkInvoiceAmount } from '../../utils/orderUtils';

interface IInvoiceParams {
  orderId: string;
  amount?: number;
  _id?: string;
}

const INVOICE_STATUSES = {
  PAID: 'PAID',
  OPEN: 'open'
};

const paymentMutations = {
  async createQpaySimpleInvoice(
    _root,
    params: IInvoiceParams,
    { config }: IContext
  ) {
    if (!config.qpayConfig) {
      throw new Error('QPay config missing');
    }

    try {
      const { orderId, amount } = params;

      const order = await Orders.getOrder(orderId);

      await checkInvoiceAmount({ order, amount });

      const tokenInfo = await fetchQPayToken(config.qpayConfig);

      const invoiceData = await requestQPayInvoice(
        {
          invoice_code: config.qpayConfig.invoiceCode,
          sender_invoice_no: order._id,
          invoice_receiver_code: 'terminal',
          invoice_description: order.number,
          amount: amount ? amount : order.totalAmount,
          callback_url: `${config.qpayConfig.callbackUrl}?payment_id=${order._id}`
        },
        tokenInfo.access_token,
        config.qpayConfig
      );

      const invoice = await QPayInvoices.createInvoice({
        senderInvoiceNo: order._id,
        amount: amount ? amount.toString() : order.totalAmount.toString()
      });

      if (invoiceData) {
        await QPayInvoices.updateInvoice(invoice._id, invoiceData);
      }

      return QPayInvoices.findOne({ _id: invoice._id });
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async qpayCancelInvoice(
    _root,
    { _id }: IInvoiceParams,
    { config }: IContext
  ) {
    try {
      const tokenInfo = await fetchQPayToken(config.qpayConfig);
      const invoice = await QPayInvoices.getInvoice(_id);

      if (invoice.status === INVOICE_STATUSES.PAID) {
        throw new Error('Can not cancel paid invoice');
      }

      if (invoice.status === INVOICE_STATUSES.OPEN) {
        const response = await requestInvoiceDeletion(
          invoice.qpayInvoiceId,
          tokenInfo.access_token,
          config.qpayConfig
        );

        if (JSON.stringify(response) === '{}') {
          // successful cancel
          await QPayInvoices.deleteOne({ _id });
        }

        return 'success';
      }
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async qpayCheckPayment(_root, { _id }: IInvoiceParams, { config }: IContext) {
    const invoice = await QPayInvoices.getInvoice(_id);

    if (
      invoice.status === INVOICE_STATUSES.PAID &&
      invoice.qpayPaymentId &&
      invoice.paymentDate
    ) {
      throw new Error('QPay payment already made');
    }

    const tokenInfo = await fetchQPayToken(config.qpayConfig);
    const response = await fetchInvoicePayment(
      invoice.qpayInvoiceId,
      tokenInfo.access_token,
      config.qpayConfig
    );

    // check payment info
    const { rows = [], count = 0 } = response;

    if (count && rows.length > 0) {
      const row = rows.find(
        r => r.payment_status === INVOICE_STATUSES.PAID && r.payment_id
      );

      if (
        row &&
        invoice.status !== INVOICE_STATUSES.PAID &&
        !invoice.qpayPaymentId
      ) {
        await QPayInvoices.updateOne(
          { _id: invoice._id },
          {
            $set: {
              qpayPaymentId: row.payment_id,
              paymentDate: row.payment_date || new Date(),
              status: row.payment_status
            }
          }
        );

        const order = await Orders.getOrder(invoice.senderInvoiceNo);

        const paidMobileAmount = await QPayInvoices.getPaidAmount(order._id);

        await Orders.updateOne(
          { _id: invoice.senderInvoiceNo },
          {
            $set: { mobileAmount: paidMobileAmount }
          }
        );
      }
    }

    return QPayInvoices.findOne({ _id: invoice._id });
  }
};

export default paymentMutations;
