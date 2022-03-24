import { ICommonTypes } from "../commonTypes";

export type IVoucherCompaign = ICommonTypes & {
  buyScore?: number,

  score?: number,
  scoreAction?: string,

  voucherType?: string,

  productCategoryIds?: string[],
  productIds?: string[],
  discountPercent?: number,

  bonusProductId?: string,
  bonusCount?: number,

  coupon?: string,

  spinCompaignId?: string,
  spinCount?: number,

  lotteryCompaignId?: string,
  lotteryCount?: number,

  vouchersCount?: number,
};

// query types
export type VoucherCompaignQueryResponse = {
  voucherCompaigns: IVoucherCompaign[];
  loading: boolean;
  refetch: () => void;
};

export type VoucherCompaignDetailQueryResponse = {
  voucherCompaignDetail: IVoucherCompaign;
  loading: boolean;
  refetch: () => void;
};

export type VoucherCompaignsCountQueryResponse = {
  voucherCompaignsCount: number;
  loading: boolean;
  refetch: () => void;
};

export type VoucherCompaignRemoveMutationResponse = {
  voucherCompaignsRemove: (mutation: {
    variables: { _ids: string[] };
  }) => Promise<any>;
}