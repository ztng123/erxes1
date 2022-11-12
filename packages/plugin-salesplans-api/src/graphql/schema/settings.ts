export const types = `
  type SPLabel {
    _id: String
    title: String
    description: String
    effect: String
    status: String
    color: String
    multiplier: Float
  },

  type Timeframe {
    _id: String
    name: String
    description: String
    startTime: Int
    endTime: Int
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
  }
`;

export const paginateParams = `
  page: Int,
  perPage: Int,
  sortField: String,
  sortDirection: Int,
`;
export const filterParams = `
  _ids:[String],
  searchValue: String,
  filterStatus: String,
  minMultiplier: Float,
  maxMultiplier: Float
`;

export const queries = `
  spLabels(${filterParams}, ${paginateParams}): [SPLabel],
  spLabelsCount(${filterParams}): Int,
  timeframes: [Timeframe]
`;

const params = `
  title: String,
  description: String,
  effect: String,
  status: String,
  color: String,
  multiplier: Float
`;

export const mutations = `
  timeframesEdit(update:[TimeframeInput], add:[AddTimeframeInput]): [Timeframe]
  timeframesRemove(_id: String): JSON
  spLabelsAdd(${params}): SPLabel
  spLabelsEdit(_id: String!, ${params}): SPLabel
  spLabelsRemove(_ids: [String]): JSON
`;
