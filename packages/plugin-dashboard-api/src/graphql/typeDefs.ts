import gql from 'graphql-tag';

const types = `
  type Dashboard {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
  
    currentType: DashboardType
  }

  type DashboardType {
    _id: String!
    name: String
  }
`;

const queries = `
  dashboards(typeId: String): [Dashboard]
  dashboardTypes: [DashboardType]
  dashboardsTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

const mutations = `
  dashboardsAdd(${params}): Dashboard
  dashboardsRemove(_id: String!): JSON
  dashboardsEdit(_id:String!, ${params}): Dashboard
  dashboardTypesAdd(name:String):DashboardType
  dashboardTypesRemove(_id: String!):JSON
  dashboardTypesEdit(_id: String!, name:String): DashboardType
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
