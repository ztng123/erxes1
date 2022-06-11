const listParamsDef = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int
  $searchValue: String
  $departmentId: String
  $branchId: String

  $beginDate: Date
  $endDate: Date
  $productId: String
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection
  searchValue: $searchValue
  departmentId: $departmentId
  branchId: $branchId
  beginDate: $beginDate
  endDate: $endDate
  productId: $productId
`;

export const safeRemainderFields = `
  _id
  createdAt
  createdBy
  modifiedAt
  modifiedBy

  date
  description

  status
  branchId
  departmentId

  branch {
    _id
    code
    title
  }
  department {
    _id
    code
    title
  }
  modifiedUser {
    _id
    details {
      avatar
      fullName
    }
  }

`;

const safeRemainders = `
  query safeRemainders(
    ${listParamsDef}
  ) {
    safeRemainders(
      ${listParamsValue}
    ) {
      remainders {
        ${safeRemainderFields}
      }

      totalCount
    }
  }
`;

const safeRemainderDetail = `
query safeRemainderDetail(
  $_id: String!
) {
  safeRemainderDetail(
    _id: $_id
  ) {
    ${safeRemainderFields}
  }
}
`;

export default {
  safeRemainders,
  safeRemainderDetail
};
