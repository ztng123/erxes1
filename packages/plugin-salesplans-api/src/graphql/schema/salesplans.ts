import {
  attachmentType,
  attachmentInput
} from '@erxes/api-utils/src/commonTypeDefs';

export const types = () => `
  ${attachmentType}
  ${attachmentInput}
  extend type Branch @key(fields: "_id") {
    _id: String! @external
  }

  extend type Department @key(fields: "_id") {
    _id: String! @external
  }

  extend type User @key(fields: "_id") {
    _id: String! @external
  }

  type SalesLog @key(fields: "_id"){
    _id: String!
    branchId: String
    date: Date
    branchDetail: Branch
    description: String
    name: String
    type: String
    departmentId:String
    departmentDetail: Department
    createdBy:String
    createdUser: User
    createdAt: Date
    status: String
  },

  type Label {
    _id: String
    title: String
    color: String
    type: String
    status: String
  },

  type Timeframe {
    _id: String
    name: String
    description: String
    startTime: Int
    endTime: Int
  },

  type DayPlanConfig {
    _id: String
    salesLogId: String
    labelIds: [String]
    timeframeId: String
  },

  type MonthPlanConfig {
    _id: String
    salesLogId: String
    labelIds: [String]
    day: Int
  },

  type YearPlanConfig {
    _id: String
    salesLogId: String
    labelIds: [String]
    month: Int
  },

  input TimeframeInput {
    _id: String
    name: String
    description: String
    startTime: Int
    endTime: Int
  },

  input AddTimeframeInput {
    name: String
    description: String
    startTime: Int
    endTime: Int
  },

  input LabelInput {
    _id: String
    title: String
    color: String
    type: String
    status:String
  },

  input AddLabelInput {
    title: String
    color: String
    type: String
    status:String 
  },
`;

const salesLogPrams = `
  branchId: String,
  date: Date,
  description:String,
  name:String,
  type:String,
  departmentId:String,
`;
export const queries = `
  getDayPlanConfig(salesLogId: String): [DayPlanConfig]
  getMonthPlanConfig(salesLogId: String): [MonthPlanConfig]
  getYearPlanConfig(salesLogId: String): [YearPlanConfig]
  getLabels(type: String): [Label]
  getSalesLogs: [SalesLog]
  getSalesLogDetail(salesLogId: String): SalesLog
  getTimeframes:[Timeframe]
`;

export const mutations = `
  createSalesLog(${salesLogPrams}): SalesLog
  saveLabels(update: [LabelInput], add: [AddLabelInput]): [Label]
  saveTimeframes(update:[TimeframeInput], add:[AddTimeframeInput]):[Timeframe]
  saveDayPlanConfig(salesLogId: String, data:JSON):[DayPlanConfig]
  saveMonthPlanConfig(salesLogId: String, day: Date, data:JSON):[MonthPlanConfig]
  saveYearPlanConfig(salesLogId: String, data:JSON):[YearPlanConfig]
  removeLabel(_id:String): JSON
  removeTimeframe(_id: String): JSON
  removeSalesLog(_id: String): JSON
`;
