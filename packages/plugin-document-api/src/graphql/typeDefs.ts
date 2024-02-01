import gql from 'graphql-tag';

const types = `
  type Document {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: DocumentType
  }

  type DocumentType {
    _id: String!
    name: String
  }
`;

const queries = `
  documents(typeId: String): [Document]
  documentTypes: [DocumentType]
  documentsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

const mutations = `
  documentsAdd(${params}): Document
  documentsRemove(_id: String!): JSON
  documentsEdit(_id:String!, ${params}): Document
  documentTypesAdd(name:String):DocumentType
  documentTypesRemove(_id: String!):JSON
  documentTypesEdit(_id: String!, name:String): DocumentType
`;


const typeDefs = async _serviceDiscovery => {
  return gql`
    scalar JSON
    scalar Date

    ${types}
    
    extend type Query {
      ${queries}
    }
    
    extend type Mutation {
      ${mutations}
    }
  `;
};

export default typeDefs;
