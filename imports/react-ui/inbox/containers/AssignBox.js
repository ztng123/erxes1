import React, { PropTypes } from 'react';
import { compose, gql, graphql } from 'react-apollo';
import { AssignBox } from '../components';
import { queries } from '../graphql';

const AssignBoxContainer = props => {
  const { usersQuery, conversationsQuery } = props;

  if (usersQuery.loading || conversationsQuery.loading) {
    return null;
  }

  const assign = ({ targetIds, assignedUserId }, callback) => {
    const params = { conversationIds: targetIds, assignedUserId };

    Meteor.call('conversations.assign', params, (...params) => {
      conversationsQuery.refetch();
      callback(...params);
    });
  };

  const clear = (conversationIds, callback) => {
    conversationsQuery.refetch();
    Meteor.call('conversations.unassign', { conversationIds }, callback);
  };

  const updatedProps = {
    ...props,
    targets: conversationsQuery.conversations,
    assignees: usersQuery.users,
    assign,
    clear,
  };

  return <AssignBox {...updatedProps} />;
};

AssignBoxContainer.propTypes = {
  targets: PropTypes.array,
  usersQuery: PropTypes.object,
  conversationsQuery: PropTypes.object,
};

export default compose(
  graphql(gql(queries.userList), { name: 'usersQuery' }),
  graphql(gql(queries.conversationList), {
    name: 'conversationsQuery',
    options: ({ targets }) => ({
      variables: {
        params: {
          ids: targets,
        },
      },
    }),
  }),
)(AssignBoxContainer);
