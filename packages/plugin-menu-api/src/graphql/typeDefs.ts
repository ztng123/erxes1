import gql from 'graphql-tag';

const types = `
  type Menu {
    _id: String!
    name: String
    createdAt:Date
    expiryDate:Date
    checked:Boolean
    typeId: String
    title: String  
    content: String  
    parentId: String  
    children: [Menu]  
    currentType: MenuType
  }

  type MenuType {
    _id: String!
    name: String
  }
`;

const queries = `
  menus(typeId: String): [Menu]
  menuTypes: [MenuType]
  menusTotalCount: Int
`;

const params = `
  name: String,
  expiryDate: Date,
  checked: Boolean,
  typeId:String
`;

const mutations = `
  menusAdd(${params}): Menu
  menusRemove(_id: String!): JSON
  menusEdit(_id:String!, ${params}): Menu
  menuTypesAdd(name:String):MenuType
  menuTypesRemove(_id: String!):JSON
  menuTypesEdit(_id: String!, name:String): MenuType
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
