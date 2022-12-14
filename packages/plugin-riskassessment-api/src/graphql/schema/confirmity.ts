import { commonPaginateTypes, commonTypes } from './common';

export const types = `
    type RiskConformity {
        _id: String,
        cardId: String,
        cardType: String,
        status: String,
        statusColor: String,
        resultScore:String,
        riskAssessmentId: String,
        createdAt: Date,
        riskAssessment:JSON
        card:JSON
    }
    type RiskConformityDetail{
        createdAt: String
        _id: String,
        name: String,
        description: String,
        categoryId: String,
        status: String,
    }
    type RiskConformityFormDetailType {
        fields:JSON,
        submissions:JSON,
        formId: String
    }
`;

export const queries = `
    riskConformity(cardId:String,riskAssessmentId:String):RiskConformity
    riskConformities(cardId:String,riskAssessmentId:String,status:String,${commonTypes},${commonPaginateTypes}):[RiskConformity]
    riskConformitiesTotalCount(cardId:String,riskAssessmentId:String,status:String,${commonTypes},${commonPaginateTypes}): Int
    riskConformityDetails(cardId:String) :[RiskConformity]
    riskConformitySubmissions(cardId:String,cardType:String) :JSON
    riskConformityFormDetail(cardId:String,userId: String,riskAssessmentId:String) :RiskConformityFormDetailType
`;

export const mutations = `
    addRiskConformity (cardId: String,cardType:String,riskAssessmentId: String):RiskConformity
    updateRiskConformity (cardId: String,cardType:String,riskAssessmentId: String):RiskConformity
    removeRiskConformity (cardId: String,cardType:String):String
`;
