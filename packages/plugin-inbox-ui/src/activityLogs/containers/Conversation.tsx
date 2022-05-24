import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { IActivityLog } from '@erxes/ui-logs/src/activityLogs/types';
import Spinner from '@erxes/ui/src/components/Spinner';
import { withProps } from '@erxes/ui/src/utils';
import { queries } from '@erxes/ui-inbox/src/inbox/graphql';
import {
  ConversationDetailQueryResponse,
  FacebookCommentsQueryResponse,
  MessagesQueryResponse
} from '@erxes/ui-inbox/src/inbox/types';
import React from 'react';
import { graphql } from 'react-apollo';
import Conversation from '../components/Conversation';

type Props = {
  activity: IActivityLog;
  conversationId: string;
};

type FinalProps = {
  messagesQuery: MessagesQueryResponse;
  commentsQuery: FacebookCommentsQueryResponse;
  conversationDetailQuery: ConversationDetailQueryResponse;
} & Props;

class ConversationContainer extends React.Component<FinalProps> {
  render() {
    const {
      conversationDetailQuery,
      messagesQuery,
      commentsQuery
    } = this.props;

    if (conversationDetailQuery.loading || messagesQuery.loading) {
      return <Spinner />;
    }

    const conversation = conversationDetailQuery.conversationDetail;
    const messages = messagesQuery.conversationMessages || [];
    const comments =
      (commentsQuery && commentsQuery.integrationsConversationFbComments) || [];

    const updatedProps = {
      ...this.props,
      conversation,
      messages,
      comments
    };

    return <Conversation {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, ConversationDetailQueryResponse>(
      gql(queries.conversationDetail),
      {
        name: 'conversationDetailQuery',
        options: ({ conversationId }) => ({
          variables: {
            _id: conversationId
          }
        })
      }
    ),
    graphql<Props, MessagesQueryResponse>(gql(queries.conversationMessages), {
      name: 'messagesQuery',
      options: ({ conversationId }) => ({
        variables: {
          conversationId,
          limit: 10,
          getFirst: true
        }
      })
    }),
    graphql<Props, FacebookCommentsQueryResponse>(
      gql(queries.integrationsConversationFbComments),
      {
        name: 'commentsQuery',
        skip: ({ activity }) => activity.contentType !== 'comment',
        options: ({ conversationId, activity }) => ({
          variables: {
            postId: conversationId,
            senderId: activity.contentId
          }
        })
      }
    )
  )(ConversationContainer)
);
