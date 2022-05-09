import { sendRequest } from '@erxes/api-utils/src';
import {
  sendCoreMessage,
  sendNotificationsMessage,
  sendContactsMessage,
  sendProductsMessage
} from './messageBroker';

export const sendNotification = (subdomain: string, data) => {
  return sendNotificationsMessage({ subdomain, action: 'send', data });
};

export const getConfig = async (subdomain, code, defaultValue?) => {
  return await sendCoreMessage({
    subdomain,
    action: 'getConfig',
    data: { code, defaultValue },
    isRPC: true
  });
};

export const validCompanyCode = async (config, companyCode) => {
  let result = false;

  const re = new RegExp('(^[А-ЯЁӨҮ]{2}[0-9]{8}$)|(^\\d{7}$)', 'gui');

  if (re.test(companyCode)) {
    const response = await sendRequest({
      url: config.checkCompanyUrl,
      method: 'GET',
      params: { regno: companyCode }
    });

    if (response.found) {
      result = response.name;
    }
  }
  return result;
};

export const companyCheckCode = async (user, params, subdomain) => {
  const config = await getConfig(subdomain, 'EBARIMT', {});
  const company = params.updatedDocument || params.object;
  const companyName = await validCompanyCode(config, company.code);

  if (companyName) {
    if (company.primaryName !== companyName) {
      company.primaryName = companyName;

      await sendContactsMessage({
        subdomain,
        action: 'companies.updateCompany',
        data: {
          _id: company._id,
          doc: {
            company,
            primaryName: companyName,
            names: [companyName]
          }
        },
        isRPC: true
      });
    }
  } else {
    sendNotificationsMessage({
      subdomain,
      action: 'send',
      data: {
        createdUser: user,
        receivers: [user._id],
        title: 'wrong company code',
        content: `Байгууллагын код буруу бөглөсөн байна. "${company.code}"`,
        notifType: 'companyMention',
        link: `/companies/details/${company._id}`,
        action: 'update',
        contentType: 'company',
        contentTypeId: company._id
      },
      defaultValue: true
    });
  }
};

export const validConfigMsg = async config => {
  if (!config.url) {
    return 'required url';
  }
  return '';
};

export const getPostData = async (subdomain, config, deal) => {
  let billType = '1';
  let customerCode = '';
  let customerName = '';

  const companyIds = await sendCoreMessage({
    subdomain,
    action: 'conformities.savedConformity',
    data: { mainType: 'deal', mainTypeId: deal._id, relTypes: ['company'] },
    isRPC: true,
    defaultValue: []
  });

  if (companyIds.length > 0) {
    const companies = await sendContactsMessage({
      subdomain,
      action: 'companies.findActiveCompanies',
      data: {
        selector: { _id: { $in: companyIds } },
        fields: { _id: 1, code: 1 }
      },
      isRPC: true,
      defaultValue: []
    });

    const re = new RegExp('(^[А-ЯЁӨҮ]{2}[0-9]{8}$)|(^\\d{7}$)', 'gui');
    for (const company of companies) {
      if (re.test(company.code)) {
        const checkCompanyRes = await sendRequest({
          url: config.checkCompanyUrl,
          method: 'GET',
          params: { regno: company.code }
        });

        if (checkCompanyRes.found) {
          billType = '3';
          customerCode = company.code;
          customerName = company.primaryName;
          continue;
        }
      }
    }
  }

  if (billType === '1') {
    const customerIds = await sendCoreMessage({
      subdomain,
      action: 'conformities.savedConformity',
      data: { mainType: 'deal', mainTypeId: deal._id, relTypes: ['customer'] },
      isRPC: true,
      defaultValue: []
    });

    if (customerIds.length > 0) {
      const customers = await sendContactsMessage({
        subdomain,
        action: 'customers.findActiveCustomers',
        data: {
          selector: { _id: { $in: customerIds } },
          fields: { _id: 1, code: 1 }
        },
        isRPC: true,
        defaultValue: []
      });
      customerCode = customers.length > 0 ? customers[0].code : '' || '';
    }
  }

  const productsIds = deal.productsData.map(item => item.productId);
  const products = await sendProductsMessage({
    subdomain,
    action: 'find',
    data: { query: { _id: { $in: productsIds } } },
    isRPC: true,
    defaultValue: []
  });

  const productsById = {};
  for (const product of products) {
    productsById[product._id] = product;
  }

  const details = [] as any;

  for (const productData of deal.productsData) {
    // not tickUsed product not sent
    if (!productData.tickUsed) {
      continue;
    }

    // if wrong productId then not sent
    if (!productsById[productData.productId]) {
      continue;
    }

    details.push({
      count: productData.quantity,
      amount: productData.amount,
      discount: productData.discount,
      inventoryCode: productsById[productData.productId].code,
      productId: productData.productId
    });
  }

  const sumSaleAmount = details.reduce((predet, detail) => {
    return { amount: predet.amount + detail.amount };
  }).amount;

  const cashAmount = (deal.paymentsData || {}).cashAmount || 0;
  const nonCashAmount = sumSaleAmount - cashAmount;

  const orderInfo = {
    date: new Date().toISOString().slice(0, 10),
    orderId: deal._id,
    hasVat: config.hasVat || false,
    hasCitytax: config.hasCitytax || false,
    billType,
    customerCode,
    customerName,
    description: deal.name,
    details,
    cashAmount,
    nonCashAmount,
    ebarimtResponse: {}
  };

  return {
    ...orderInfo,
    productsById,
    contentType: 'deal',
    contentId: deal._id
  };
};
