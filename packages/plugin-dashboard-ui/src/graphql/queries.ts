const list = `
  query listQuery($typeId: String) {
    dashboards(typeId: $typeId) {
      _id
      name
      expiryDate
      createdAt
      checked
      typeId
      currentType{
        _id
        name
      }
    }
  }
`;

const listDashboardTypes = `
  query listDashboardTypeQuery{
    dashboardTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query dashboardsTotalCount{
    dashboardsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listDashboardTypes
};
