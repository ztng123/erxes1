import { DISTRICTS } from "./constants";
import { sendRequest } from "@erxes/api-utils/src";

const format_number = (num: number) => {
  return num.toFixed(2);
};

export interface IPutDataArgs {
  data: Date;
  orderId: string;
  hasVat: boolean;
  hasCitytax: boolean;
  billType: string;
  customerCode: string;
  customerName: string;
  productsById: any;
  details: any[];
  cashAmount: number;
  nonCashAmount: number;

  transaction;
  records;
  taxType: string;
  returnBillId: string;

  config: any;
  models: any;
  contentType: string;
  contentId: string;
}

export class PutData<IListArgs extends IPutDataArgs> {
  public districtCode!: string;
  public params: IListArgs;
  public transactionInfo: any;
  public models: any;
  public vatPercent!: number;
  public cityTaxPercent!: number;
  public defaultGScode!: string;
  public config: any;

  constructor(params: IListArgs) {
    this.params = params;
    this.models = params.models;
    this.config = params.config;
  }

  private async generateStock(detail, vat, citytax) {
    if (!detail.count) {
      return;
    }

    const product = this.params.productsById[detail.productId] || {};
    if (!product._id) {
      return;
    }

    return {
      code: detail.inventoryCode,
      barCode: this.defaultGScode,
      name: product.name,
      measureUnit: product.sku,
      qty: format_number(detail.count),
      unitPrice: format_number(detail.amount / detail.count),
      totalAmount: format_number(detail.amount),
      vat: format_number(vat),
      cityTax: format_number(citytax),
      discount: format_number(detail.discount),
    };
  }

  private async generateStocks() {
    let sumAmount = 0;
    let vatAmount = 0;
    let citytaxAmount = 0;
    const stocks = [] as any;

    const taxPercent = this.vatPercent + this.cityTaxPercent;

    for (const detail of this.params.details) {
      sumAmount += detail.amount;

      const vat = (detail.amount / (100 + taxPercent)) * this.vatPercent;
      vatAmount += vat;

      const cityTax =
        (detail.amount / (100 + taxPercent)) * this.cityTaxPercent;
      citytaxAmount += cityTax;

      stocks.push(await this.generateStock(detail, vat, cityTax));
    }

    return { stocks, sumAmount, vatAmount, citytaxAmount };
  }

  private async generateTransactionInfo() {
    const {
      stocks,
      sumAmount,
      vatAmount,
      citytaxAmount,
    } = await this.generateStocks();

    return {
      cashAmount: format_number(sumAmount),
      nonCashAmount: format_number(0),

      amount: format_number(sumAmount),
      vat: format_number(vatAmount),
      cityTax: format_number(citytaxAmount),

      districtCode: this.districtCode,
      billType: this.params.billType,
      taxType: this.params.taxType,

      stocks,

      customerNo: this.params.customerCode,

      // # Хэрвээ буцаах гэж байгаа бол түүний ДДД
      returnBillId: this.params.returnBillId,
    };
  }

  public async run() {
    const url = this.config.ebarimtUrl || "";
    this.districtCode = DISTRICTS[this.config.districtName] || "";
    const rd = this.config.companyRD || "";
    this.vatPercent = this.config.vatPercent || 0;
    this.cityTaxPercent = this.config.cityTaxPercent || 0;
    this.defaultGScode = this.config.defaultGSCode || "";

    const { contentType, contentId } = this.params;

    if (!Object.values(DISTRICTS).includes(this.districtCode)) {
      throw new Error("Not validate District");
    }

    this.transactionInfo = await this.generateTransactionInfo();

    const prePutResponse = await this.models.PutResponses.putHistories(
      {
        contentType,
        contentId,
      }
    );

    if (prePutResponse) {
      this.transactionInfo.returnBillId = prePutResponse.billId;
    }

    const resObj = await this.models.PutResponses.createPutResponse(
      {
        sendInfo: { ...this.transactionInfo },
        contentId,
        contentType,
      }
    );

    const responseStr = await sendRequest({
      url: `${url}/put?lib=${rd}`,
      method: "POST",
      body: { data: this.transactionInfo },
      params: { data: this.transactionInfo },
    });

    const response = JSON.parse(responseStr);

    if (
      response.billType == "1" &&
      response.lottery == "" &&
      response.success
    ) {
      if (prePutResponse) {
        response.lottery = prePutResponse.lottery;
      } else {
        response.getInformation = await sendRequest({
          url: `${url}/getInformation?lib=${rd}`,
          method: "GET",
        });
      }
    }

    await this.models.PutResponses.updatePutResponse(resObj._id, {
      ...response,
      customerName: this.params.customerName,
    });

    return this.models.PutResponses.findOne({ _id: resObj._id }).lean();
  }
}

export const returnBill = async (models, doc, config) => {
  const url = config.ebarimtUrl || "";
  const { contentType, contentId } = doc;

  const prePutResponse = await models.PutResponses.putHistories(models, {
    contentType,
    contentId,
  });

  if (!prePutResponse) {
    return {
      error: "Буцаалт гүйцэтгэх шаардлагагүй баримт байна.",
    };
  }

  const rd = prePutResponse.registerNo;
  const data = {
    returnBillId: prePutResponse.billId,
    date: prePutResponse.date,
  };

  const resObj = await models.PutResponses.createPutResponse(models, {
    sendInfo: { ...data },
    contentId,
    contentType,
  });

  const responseStr = await sendRequest({
    url: `${url}/returnBill?lib=${rd}`,
    method: "POST",
    body: { data },
    params: { ...data },
  });

  const response = JSON.parse(responseStr);
  await models.PutResponses.updatePutResponse(models, resObj._id, {
    ...response,
  });

  return models.PutResponses.findOne({ _id: resObj._id }).lean();
};
