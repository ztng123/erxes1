import { getEnv } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { makeInvoiceNo } from '../../../utils';

type InvoiceParams = {
  amount: number;
  phone: string;
  email: string;
  description: string;
  customerId: string;
  companyId: string;
  contentType: string;
  contentTypeId: string;
  paymentIds: string[];
  redirectUri: string;
};

const mutations = {
  async generateInvoiceUrl(
    _root,
    params: InvoiceParams,
    { models, requestInfo, res }: IContext
  ) {
    const MAIN_API_DOMAIN = process.env.DOMAIN
      ? `${process.env.DOMAIN}/gateway`
      : 'http://localhost:4000';

    const dataInCookie = requestInfo.cookies['paymentData'];

    const paymentData =
      dataInCookie &&
      JSON.parse(
        Buffer.from(dataInCookie as string, 'base64').toString('ascii')
      );

    if (
      dataInCookie &&
      paymentData.amount === params.amount &&
      paymentData.customerId === params.customerId &&
      paymentData.contentTypeId === params.contentTypeId
    ) {
      return `${MAIN_API_DOMAIN}/pl:payment/gateway?params=${dataInCookie}`;
    }

    const invoice = await models.Invoices.create({
      ...params,
      identifier: makeInvoiceNo(32)
    });

    const base64 = Buffer.from(
      JSON.stringify({ _id: invoice._id, ...params })
    ).toString('base64');

    const NODE_ENV = getEnv({ name: 'NODE_ENV' });

    const secure = !['test', 'development'].includes(NODE_ENV);

    const maxAge = 10 * 60000;

    const cookieOptions: any = {
      maxAge,
      expires: new Date(Date.now() + maxAge),
      sameSite: 'none',
      secure: requestInfo.secure
    };

    if (!secure && cookieOptions.sameSite) {
      delete cookieOptions.sameSite;
    }

    res.cookie('paymentData', base64, cookieOptions);

    return `${MAIN_API_DOMAIN}/pl:payment/gateway?params=${base64}`;
  }
};

export default mutations;
