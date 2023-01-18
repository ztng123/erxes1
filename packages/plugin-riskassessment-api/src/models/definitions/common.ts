export interface PaginateField {
  perPage?: number;
  searchValue?: string;
  sortDirection?: number;
  sortFromDate?: string;
  sortToDate?: string;
}
type IRiskIndicatorCalculateLogicsField = {
  key: string;
  name: string;
  value: number;
  value2: number;
  logic: string;
};
export interface IRiskIndicatorsField {
  name?: string;
  description?: string;
  createdAt?: string;
  categoryId?: string;
  status?: string;
  calculateMethod?: string;
  calculateLogics?: IRiskIndicatorCalculateLogicsField[];
}

export interface IRiskAssessmentCategoryField extends PaginateField {
  _id?: string;
  name: string;
  formId: string;
  parentId: string;
  code: string;
  type: string;
}

export interface IRiskConformityField {
  _id: string;
  cardId: string;
  boardId: string;
  pipelineId: string;
  cardType: string;
  riskIndicatorIds: string[];
}

export interface IRiskConformityParams {
  cardId: string;
  cardType: string;
  riskIndicatorIds?: string;
}

export interface IRiskFormSubmissionParams {
  cardId: string;
  cardType: string;
  userId: string;
  formId: string;
  formSubmissions: {
    [key: string]: string;
  };
}

export type IRiskFormSubmissionsField = {
  _id: string;
  cardId: string;
  userId: string;
  formId: string;
  fieldId: string;
  value: number;
};
