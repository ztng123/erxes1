import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { Inbox as InboxComponent } from '../components';
import { queries } from '../graphql';

const Inbox = props => {
  const { conversationsQuery, currentConversationQuery } = props;

  if (conversationsQuery.loading || currentConversationQuery.loading) {
    return false;
  }

  // =============== actions
  const changeStatus = () => {};

  const conversations = conversationsQuery.conversations;
  const currentConversation = currentConversationQuery.conversationsGetCurrent;

  const updatedProps = {
    ...this.props,
    conversations,
    currentConversation,
    changeStatus
  };

  return <InboxComponent {...updatedProps} />;
};

Inbox.propTypes = {
  conversationsQuery: PropTypes.object,
  currentConversationQuery: PropTypes.object
};

export default compose(
  graphql(gql(queries.conversationList), {
    name: 'conversationsQuery',
    options: ({ queryParams }) => {
      const params = { ...queryParams };
      delete params._id;

      return {
        variables: { params }
      };
    }
  }),
  graphql(gql(queries.currentConversation), {
    name: 'currentConversationQuery',
    options: ({ queryParams }) => {
      return {
        variables: { _id: queryParams._id }
      };
    }
  })
)(Inbox);
