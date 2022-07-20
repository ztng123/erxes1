const fields = `
      _id
      name
      description
      html
      css
      jsonData
`;

const pages = `
  query pages {
    webbuilderPages {
      ${fields}
    }
  }
`;

const pageDetail = `
  query pageDetail($_id: String!) {
    webbuilderPageDetail(_id: $_id) {
      ${fields}
    }
  }
`;

const contentTypes = `
  query contentTypes {
    webbuilderContentTypes {
      _id
      code
      displayName
      fields
    }
  }
`;

const contentTypeDetail = `
  query contentTypeDetail($_id: String!) {
    webbuilderContentTypeDetail(_id: $_id) {
      _id
      code
      displayName
      fields
    }
  } 
`;

export default {
  pages,
  pageDetail,
  contentTypes,
  contentTypeDetail
};
