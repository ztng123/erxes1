import { IContext } from '..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import { IPost } from '../../db/models/post';
import { IComment } from '../../db/models/comment';

const ForumComment: IObjectTypeResolver<IComment, IContext> = {
  async post({ postId }, _, { models: { Post } }) {
    return Post.findById(postId).lean();
  },
  async replyTo({ replyToId }, _, { models: { Comment } }) {
    return Comment.findById(replyToId).lean();
  },
  async replies({ _id }, _, { models: { Comment } }) {
    return Comment.find({ replyToId: _id }).lean();
  }
};

export default ForumComment;
