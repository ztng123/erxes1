const list = `
  query listQuery($typeId: String) {
    documents(typeId: $typeId) {
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

const listDocumentTypes = `
  query listDocumentTypeQuery{
    documentTypes{
      _id
      name
    }
  }
`;

const totalCount = `
  query documentsTotalCount{
    documentsTotalCount
  }
`;

export default {
  list,
  totalCount,
  listDocumentTypes
};
