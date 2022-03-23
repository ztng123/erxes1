import { commonParamDefs, commonParams } from '../../commonTypes';
import { voucherCompaignFields } from './queries';

const paramDefs = `
  ${commonParamDefs}
  $buyScore: Float,
  $score: Float,
  $scoreAction: String,
  $voucherType: String,
  $productCategoryIds: [String],
  $productIds: [String],
  $discountPercent: Float,
  $bonusProductId: String,
  $bonusCount: Float,
  $coupon: String,
  $spinCompaignId: String,
  $spinCount: Float,
  $lotteryCompaignId: String,
  $lotteryCount: Float,
`;

const params = `
  ${commonParams}
  buyScore: $buyScore
  score: $score
  scoreAction: $scoreAction
  voucherType: $voucherType
  productCategoryIds: $productCategoryIds
  productIds: $productIds
  discountPercent: $discountPercent
  bonusProductId: $bonusProductId
  bonusCount: $bonusCount
  coupon: $coupon
  spinCompaignId: $spinCompaignId
  spinCount: $spinCount
  lotteryCompaignId: $lotteryCompaignId
  lotteryCount: $lotteryCount
`;

const voucherCompaignsAdd = `
  mutation voucherCompaignsAdd(${paramDefs}) {
    voucherCompaignsAdd(${params}) {
      ${voucherCompaignFields}
    }
  }
`;

const voucherCompaignsEdit = `
  mutation voucherCompaignsEdit($_id: String!, ${paramDefs}) {
    voucherCompaignsEdit(_id: $_id, ${params}) {
      ${voucherCompaignFields}
    }
  }
`;

const voucherCompaignsRemove = `
  mutation voucherCompaignsRemove($_ids: [String]) {
    voucherCompaignsRemove(_ids: $_ids)
  }
`;


export default {
  voucherCompaignsAdd,
  voucherCompaignsEdit,
  voucherCompaignsRemove,
};
