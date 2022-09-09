import { commonPostsParams } from './Query';

export default `
  type ForumCategory @key(fields: "_id") {
    _id: ID!
    name: String!

    code: String
    thumbnail: String

    parentId: ID

    parent: ForumCategory
    children: [ForumCategory!]
    descendants: [ForumCategory!]
    ancestors: [ForumCategory!]

    postsCount(
      ${commonPostsParams}
    ): Int

    posts(
      ${commonPostsParams}
    ): [ForumPost!]

    
  }
`;
