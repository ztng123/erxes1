export const types = `
  type WebbuilderPage {
    _id: String!
    name: String
    description: String
    html: String
    css: String
    jsonData: JSON
  }

  type WebbuilderContentType {
    _id: String!
    code: String!
    displayName: String
    fields: JSON
  }

  type WebbuilderEntry {
    _id: String!
    contentTypeId: String
    values: JSON
  }

`;

export const queries = `
  webbuilderPages: [WebbuilderPage]
  webbuilderPageDetail(_id: String!): WebbuilderPage
  webbuilderContentTypes: [WebbuilderContentType ]
  webbuilderContentTypeDetail(_id: String!): WebbuilderContentType 
  webbuilderEntries(contentTypeId: String!): [WebbuilderEntry]
  webbuilderEntryDetail(_id: String!): WebbuilderEntry
`;

const params = `
  name: String!,
  description: String,
  html: String,
  css: String,
  jsonData: JSON,
`;

const contentTypeParams = `
  displayName: String
  code: String
  fields: JSON
`;

export const mutations = `
  webbuilderPagesAdd(${params}): WebbuilderPage
  webbuilderPagesEdit(_id: String!, ${params}): WebbuilderPage
  webbuilderContentTypesAdd(${contentTypeParams}): WebbuilderContentType 
  webbuilderContentTypesEdit(_id: String!, ${contentTypeParams}): WebbuilderContentType 
  webbuilderContentTypesRemove(_id: String!): JSON
  webbuilderEntriesAdd(contentTypeId: String! values: JSON): WebbuilderEntry
`;
