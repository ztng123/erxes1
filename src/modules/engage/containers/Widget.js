import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { Alert } from 'modules/common/utils';
import { MESSENGER_KINDS, SENT_AS_CHOICES, MESSAGE_KINDS } from '../constants';
import { Widget } from '../components';
import { queries, mutations } from '../graphql';

const WidgetContainer = props => {
  const {
    currentUserQuery,
    emailTemplatesQuery,
    brandsQuery,
    messagesAddMutation
  } = props;

  if (
    currentUserQuery.loading ||
    emailTemplatesQuery.loading ||
    brandsQuery.loading
  ) {
    return null;
  }

  const currentUser = currentUserQuery.currentUser;
  const emailTemplates = emailTemplatesQuery.emailTemplates;
  const brands = brandsQuery.brands;

  // save
  const save = (doc, callback) => {
    doc.kind = MESSAGE_KINDS.MANUAL;
    doc.isLive = true;
    doc.fromUserId = currentUser._id;

    messagesAddMutation({
      variables: doc
    })
      .then(() => {
        callback();

        Alert.success('Congrats');
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    emailTemplates,
    brands,
    save,
    messengerKinds: MESSENGER_KINDS.SELECT_OPTIONS,
    sentAsChoices: SENT_AS_CHOICES.SELECT_OPTIONS
  };

  return <Widget {...updatedProps} />;
};

WidgetContainer.propTypes = {
  emailTemplatesQuery: PropTypes.object,
  brandsQuery: PropTypes.object,
  currentUserQuery: PropTypes.object,
  messagesAddMutation: PropTypes.func
};

export default compose(
  graphql(gql(queries.emailTemplates), { name: 'emailTemplatesQuery' }),
  graphql(gql(queries.brands), { name: 'brandsQuery' }),
  graphql(gql(queries.currentUser), { name: 'currentUserQuery' }),
  graphql(gql(mutations.messagesAdd), {
    name: 'messagesAddMutation'
  })
)(WidgetContainer);
