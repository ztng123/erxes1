import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Alert } from 'modules/common/utils';
import { DealForm } from '../components';
import { queries, mutations } from '../graphql';

class DealFormContainer extends React.Component {
  render() {
    const {
      companiesQuery,
      productsQuery,
      usersQuery,
      addDealMutation,
      editDealMutation
    } = this.props;

    const companies = companiesQuery.companies || [];
    const users = usersQuery.users || [];
    const products = productsQuery.products || [];

    // create or update action
    const saveDeal = ({ doc }, callback, deal) => {
      let mutation = addDealMutation;
      // if edit mode
      if (deal) {
        mutation = editDealMutation;
        doc._id = deal._id;
      }

      mutation({
        variables: doc
      })
        .then(() => {
          Alert.success('Successfully saved!');

          callback();
        })
        .catch(error => {
          Alert.error(error.message);
        });
    };

    const extendedProps = {
      ...this.props,
      companies,
      users,
      products,
      saveDeal
    };

    return <DealForm {...extendedProps} />;
  }
}

const propTypes = {
  companiesQuery: PropTypes.object,
  usersQuery: PropTypes.object,
  productsQuery: PropTypes.object,
  addDealMutation: PropTypes.func,
  editDealMutation: PropTypes.func
};

DealFormContainer.propTypes = propTypes;

export default compose(
  graphql(gql(queries.companies), {
    name: 'companiesQuery'
  }),
  graphql(gql(queries.products), {
    name: 'productsQuery'
  }),
  graphql(gql(queries.users), {
    name: 'usersQuery'
  }),
  graphql(gql(mutations.dealsAdd), {
    name: 'addDealMutation'
  }),
  graphql(gql(mutations.dealsEdit), {
    name: 'editDealMutation'
  })
)(DealFormContainer);
