import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { compose, gql, graphql } from 'react-apollo';
import { methodCallback } from '/imports/react-ui/engage/utils';
import { Loading } from '/imports/react-ui/common';
import { AutoAndManualForm } from '../components';

const AutoAndManualFormContainer = props => {
  const {
    engageMessageDetailQuery,
    usersQuery,
    segmentsQuery,
    emailTemplatesQuery,
    messageId,
    kind,
  } = props;

  if (
    engageMessageDetailQuery.loading ||
    usersQuery.loading ||
    segmentsQuery.loading ||
    emailTemplatesQuery.loading
  ) {
    return <Loading title="New message" spin sidebarSize="wide" />;
  }

  const templates = emailTemplatesQuery.emailTemplates;
  const message = engageMessageDetailQuery.engageMessageDetail;
  const segments = segmentsQuery.segments;
  const users = usersQuery.users;

  // save
  const save = doc => {
    doc.kind = message ? message.kind : kind;

    if (messageId) {
      return Meteor.call('engage.messages.edit', { id: messageId, doc }, methodCallback);
    }

    return Meteor.call('engage.messages.add', { doc }, methodCallback);
  };

  const updatedProps = {
    ...props,
    save,
    message,
    segments,
    templates,
    users,
  };

  return <AutoAndManualForm {...updatedProps} />;
};

AutoAndManualFormContainer.propTypes = {
  messageId: PropTypes.string,
  kind: PropTypes.string,
  engageMessageDetailQuery: PropTypes.object,
  usersQuery: PropTypes.object,
  segmentsQuery: PropTypes.object,
  emailTemplatesQuery: PropTypes.object,
};

export default compose(
  graphql(
    gql`
      query engageMessageDetail($_id: String) {
        engageMessageDetail(_id: $_id) {
          _id
          kind
          segmentId
          customerIds
          title
          fromUserId
          method
          email
          isDraft
          isLive
          stopDate
          createdDate

          messenger
        }
      }
    `,
    {
      name: 'engageMessageDetailQuery',
      options: ({ messageId }) => ({
        fetchPolicy: 'network-only',
        variables: {
          _id: messageId,
        },
      }),
    },
  ),
  graphql(
    gql`
      query users {
        users {
          _id
          username
          details
        }
      }
    `,
    { name: 'usersQuery' },
  ),
  graphql(
    gql`
      query emailTemplates {
        emailTemplates {
          _id
          name
          content
        }
      }
    `,
    { name: 'emailTemplatesQuery' },
  ),
  graphql(
    gql`
      query segments {
        segments {
          _id
          name
        }
      }
    `,
    { name: 'segmentsQuery' },
  ),
)(AutoAndManualFormContainer);
