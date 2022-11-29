import { checkPermission } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { IRiskConfirmityParams } from '../../../models/definitions/common';

const RiskConfimityQuries = {
  async riskConfirmities(_root, params: IRiskConfirmityParams, { models }: IContext) {
    return await models.RiskConfimity.riskConfirmities(params);
  },
  async riskConfirmityDetails(_root, params: IRiskConfirmityParams, { models }: IContext) {
    return await models.RiskConfimity.riskConfirmityDetails(params);
  },
  async riskConfirmitySubmissions(_root, params: { cardId: string }, { models }: IContext) {
    return await models.RiskConfimity.riskConfirmitySubmissions(params);
  },

  async riskConfirmityFormDetail(_root, params, { models }: IContext) {
    return await models.RiskConfimity.riskConfirmityFormDetail(params);
  }
};

checkPermission(RiskConfimityQuries, 'riskConfirmities', 'showRiskAssessment');
checkPermission(RiskConfimityQuries, 'riskConfirmityDetails', 'showRiskAssessment');
checkPermission(RiskConfimityQuries, 'riskConfirmitySubmissions', 'showRiskAssessment');
checkPermission(RiskConfimityQuries, 'riskConfirmityFormDetail', 'showRiskAssessment');

export default RiskConfimityQuries;
