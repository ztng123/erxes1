import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { queries, mutations } from '../graphql';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import { PropertyGroupForm } from '../components';

const PropertyGroupFormContainer = (props, context) => {
  const {
    fieldsGroupsAdd,
    fieldsGroupsQuery,
    fieldsGroupsEdit,
    queryParams
  } = props;

  const { type } = queryParams;
  const { currentUser } = context;

  const add = ({ doc }) => {
    fieldsGroupsAdd({
      variables: { ...doc, contentType: type, lastUpdatedBy: currentUser._id }
    })
      .then(() => {
        fieldsGroupsQuery.refetch();
        Alert.success('Successfully added');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const edit = ({ _id, doc }) => {
    fieldsGroupsEdit({
      variables: { _id, ...doc, lastUpdatedBy: currentUser._id }
    })
      .then(() => {
        fieldsGroupsQuery.refetch();
        Alert.success('Successfully Edited');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    add,
    edit
  };

  return <PropertyGroupForm {...updatedProps} />;
};

PropertyGroupFormContainer.propTypes = {
  queryParams: PropTypes.object,
  fieldsGroupsQuery: PropTypes.object.isRequired,
  fieldsGroupsAdd: PropTypes.func.isRequired,
  fieldsGroupsEdit: PropTypes.func.isRequired
};

PropertyGroupFormContainer.contextTypes = {
  currentUser: PropTypes.object,
  closeModal: PropTypes.func
};

export default compose(
  graphql(gql(queries.fieldsgroups), {
    name: 'fieldsGroupsQuery',
    options: ({ queryParams }) => ({
      variables: {
        contentType: queryParams.type
      }
    })
  }),
  graphql(gql(mutations.fieldsGroupsAdd), {
    name: 'fieldsGroupsAdd'
  }),
  graphql(gql(mutations.fieldsGroupsEdit), {
    name: 'fieldsGroupsEdit'
  })
)(PropertyGroupFormContainer);
