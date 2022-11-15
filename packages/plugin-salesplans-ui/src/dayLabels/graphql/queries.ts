const userFields = `
  _id
  email
  username
  details {
    fullName
    shortName
  }
`;

export const paginateDefs = `
  $page: Int,
  $perPage: Int,
  $sortField: String,
  $sortDirection: Int,
`;

export const paginateValues = `
  page: $page,
  perPage: $perPage,
  sortField: $sortField,
  sortDirection: $sortDirection,
`;

const commonPlanFields = `
  _id,
  departmentId
  branchId
  labelIds
  createdAt
  createdBy
  modifiedAt
  modifiedBy

  department {
    _id
    code
    title
    parentId
  }
  branch {
    _id
    code
    title,
    parentId
  }
  labels {
    _id
    title,
    color,
    effect,
    multiplier
  }
  createdUser {
    ${userFields}
  }
  modifiedUser {
    ${userFields}
  }
`;

export const dayLabelFields = `
  ${commonPlanFields}
`;

export const filterDefs = `
  $_ids:[String],
  $filterStatus: String,
  $departmentId: String,
  $branchId: String,
  $labelId: String,
  $dateType: String,
  $startDate: Date,
  $endDate: Date,
`;

export const filterValues = `
  _ids: $_ids,
  filterStatus: $filterStatus,
  departmentId: $departmentId,
  branchId: $branchId,
  labelId: $labelId,
  dateType: $dateType,
  startDate: $startDate,
  endDate: $endDate,
`;

const dayLabels = `
  query dayLabels($date: Date, ${filterDefs} ${paginateDefs} ) {
    dayLabels(date: $date, ${filterValues} ${paginateValues}) {
      ${dayLabelFields}
    }
  }
`;

const dayLabelsCount = `
  query dayLabelsCount($year: Int, ${filterDefs}) {
    dayLabelsCount(year: $year, ${filterValues})
  }
`;

export default {
  dayLabels,
  dayLabelsCount
};
