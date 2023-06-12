export const types = `

  extend type User @key(fields: "_id") {
    _id: String! @external
  }

  type ClientPortalComment @key(fields: "_id") {
    _id: String!
    type: String,
    typeId: String,
    userId: String,
    
    userType: String,
    content: String

    createdUser: User
    createdAt: Date
  }
`;

export const queries = `
  clientPortalComments(typeId: String! type: String!): [ClientPortalComment]
`;
