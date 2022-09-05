import { authCookieOptions, getSubdomain } from '@erxes/api-utils/src/core';
import { generateModels } from './connectionResolver';
import { commonCheckPayment } from './graphql/utils/orderUtils';
import { sendPosMessage } from './messageBroker';
import { IConfigDocument } from './models/definitions/configs';

export const posInitialSetup = async (req, res) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  const config = await models.Configs.findOne();

  if (!config) {
    return res.end('no config found');
  }

  if (!res.cookie) {
    return res.end('success');
  }

  const envMaps = JSON.parse(req.query.envs || '{}');

  for (const key of Object.keys(envMaps)) {
    res.cookie(key, envMaps[key], authCookieOptions(req.secure));
  }

  return res.end('success');
};

export const callBackQpay = async (req, res) => {
  console.log('dddddddddddddddddddddddddddddddddd');
  console.log(req.query);

  const { SKIP_REDIS } = process.env;
  if (SKIP_REDIS) {
    console.log('22222222222');
    return res.send();
  }

  const subdomain = getSubdomain(req);
  console.log(subdomain);

  const models = await generateModels(subdomain);

  const { payment_id, qpay_payment_id } = req.query;
  if (!payment_id || !qpay_payment_id) {
    console.log('!payment_id || !qpay_payment_id');
    return res.send();
  }

  const orderId = payment_id;
  const order = await models.Orders.findOne({ _id: orderId }).lean();

  const pos = await sendPosMessage({
    subdomain,
    action: 'configs.find',
    data: { token: order.posToken },
    isRPC: true,
    defaultValue: {}
  });

  if (!pos.isOnline) {
    console.log('!pos.isOnline');
    return res.send();
  }

  const paymentId = qpay_payment_id;
  const invoice = await models.QPayInvoices.findOne({
    senderInvoiceNo: orderId
  }).lean();
  if (!invoice) {
    console.log('!invoice');
    return res.send();
  }

  await models.QPayInvoices.updateOne(
    { senderInvoiceNo: orderId },
    {
      $set: {
        paymentDate: new Date(),
        qpayPaymentId: paymentId,
        status: 'PAID'
      }
    }
  );
  const paidMobileAmount = await models.QPayInvoices.getPaidAmount(orderId);

  const config: IConfigDocument =
    (await models.Configs.findOne({ token: invoice.token }).lean()) ||
    ({} as IConfigDocument);

  console.log(
    '11111111111',
    {
      subdomain,
      orderId,
      config,
      paidMobileAmount
    },
    '111111111111'
  );
  await commonCheckPayment(
    subdomain,
    models,
    orderId,
    config,
    paidMobileAmount
  );

  return res.send();
};
