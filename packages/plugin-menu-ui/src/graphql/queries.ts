const list = `
  query listQuery($typeId: String) {
    menus(typeId: $typeId) {
      _id
      name
      expiryDate
      createdAt
      checked
      typeId
      title
      content
      showTitle
      currentType {
        _id
        name
      }
    }
  }
`;

const listMenuTypes = `
  query listMenuTypeQuery{
    menuTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query menusTotalCount{
    menusTotalCount
  }
`;

export default {
  list,
  totalCount,
  listMenuTypes
};
