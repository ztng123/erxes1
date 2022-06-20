import { DISTRICTS } from './definitions/constants';
import { PutResponses } from './PutResponses';

const formatNumber = (num: number): string => {
  return num && num.toFixed ? num.toFixed(2) : '0.00';
};

export interface IPutDataArgs {
  date?: string;
  orderId?: string;
  hasVat?: boolean;
  hasCitytax?: boolean;
  billType?: string;
  customerCode?: string;
  customerName?: string;
  productsById?: any;
  details?: any[];
  cashAmount?: number;
  nonCashAmount?: number;

  transaction?: any;
  records?: any;
  taxType?: string;
  returnBillId?: string;

  config?: any;
  contentType: string;
  contentId: string;
}

interface IStockItem {
  code: string;
  name: string;
  measureUnit: string;
  qty: string;
  unitPrice: string;
  totalAmount: string;
  vat: string;
  cityTax: string;
  discount: string;
}

export class PutData<IListArgs extends IPutDataArgs> {
  public districtCode: string = '';
  public params: IListArgs;
  public transactionInfo: any;
  public vatPercent: number = 10;
  public cityTaxPercent: number = 0;
  public config: any;

  constructor(params: IListArgs) {
    this.params = params;
    this.config = params.config;

    this.vatPercent = params.config.vatPercent || 0;
    this.cityTaxPercent = params.config.cityTaxPercent || 0;
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
      name: product.name,
      measureUnit: product.sku,
      qty: formatNumber(detail.count),
      unitPrice: formatNumber(detail.amount / (detail.count || 1)),
      totalAmount: formatNumber(detail.amount),
      vat: formatNumber(vat),
      cityTax: formatNumber(citytax),
      discount: formatNumber(detail.discount || 0)
    };
  }

  private async generateStocks() {
    let sumAmount = 0;
    let vatAmount = 0;
    let citytaxAmount = 0;
    const stocks: IStockItem[] = [];

    const taxPercent = this.vatPercent + this.cityTaxPercent;

    for (const detail of this.params.details || []) {
      sumAmount += detail.amount;

      const vat = (detail.amount / (100 + taxPercent)) * this.vatPercent;
      vatAmount += vat;

      const cityTax =
        (detail.amount / (100 + taxPercent)) * this.cityTaxPercent;
      citytaxAmount += cityTax;

      const stock = await this.generateStock(detail, vat, cityTax);

      if (stock) {
        stocks.push(stock);
      }
    }

    return { stocks, sumAmount, vatAmount, citytaxAmount };
  }

  private async generateTransactionInfo() {
    const {
      stocks,
      sumAmount,
      vatAmount,
      citytaxAmount
    } = await this.generateStocks();

    return {
      cashAmount: formatNumber(sumAmount),
      nonCashAmount: formatNumber(0),

      amount: formatNumber(sumAmount),
      vat: formatNumber(vatAmount),
      cityTax: formatNumber(citytaxAmount),

      districtCode: this.config.districtCode,
      billType: this.params.billType,
      taxType: this.params.taxType,

      stocks,

      customerNo: this.params.customerCode,

      // Хэрвээ буцаах гэж байгаа бол түүний ДДТД
      returnBillId: this.params.returnBillId
    };
  }

  public async run() {
    const url = this.config.ebarimtUrl || '';
    const rd = this.config.companyRD || '';

    const { contentType, contentId } = this.params;

    if (!Object.keys(DISTRICTS).includes(this.config.districtCode)) {
      throw new Error(`Invalid district code: ${this.config.districtCode}`);
    }

    this.transactionInfo = await this.generateTransactionInfo();

    const prePutResponse = await PutResponses.putHistories({
      contentType,
      contentId
    });

    if (prePutResponse) {
      this.transactionInfo.returnBillId = prePutResponse.billId;
    }

    const resObj = await PutResponses.createPutResponse({
      sendInfo: { ...this.transactionInfo },
      contentId,
      contentType
    });

    return PutResponses.findOne({ _id: resObj._id }).lean();
  }
}

export const returnBill = async (doc, config) => {
  const url = config.ebarimtUrl || '';
  const { contentType, contentId } = doc;

  const prePutResponse = await PutResponses.putHistories({
    contentType,
    contentId
  });

  if (!prePutResponse) {
    return {
      error: 'Буцаалт гүйцэтгэх шаардлагагүй баримт байна.'
    };
  }

  const rd = prePutResponse.registerNo || '';
  const data = {
    returnBillId: prePutResponse.billId || '',
    date: (prePutResponse.date || '').toString()
  };

  const resObj = await PutResponses.createPutResponse({
    sendInfo: { ...data },
    contentId,
    contentType
  });

  return PutResponses.findOne({ _id: resObj._id }).lean();
};
