import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Alert, confirm } from 'modules/common/utils';
import { queries, mutations } from '../graphql';
import { List } from '../components';

const ProductListContainer = props => {
  const {
    productsQuery,
    productsCountQuery,
    addMutation,
    editMutation,
    removeMutation
  } = props;

  const products = productsQuery.products || [];
  console.log(products);
  // remove action
  const remove = _id => {
    confirm().then(() => {
      removeMutation({
        variables: { _id }
      })
        .then(() => {
          productsQuery.refetch();

          Alert.success('Successfully deleted.');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  // create or update action
  const save = ({ doc }, callback, product) => {
    let mutation = addMutation;
    // if edit mode
    if (product) {
      mutation = editMutation;
      doc._id = product._id;
    }

    mutation({
      variables: doc
    })
      .then(() => {
        productsQuery.refetch();

        Alert.success('Successfully saved!');
        callback();
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    products,
    save,
    remove,
    loading: productsQuery.loading,
    productsCount: productsCountQuery.productsTotalCount || 0
  };

  return <List {...updatedProps} />;
};

ProductListContainer.propTypes = {
  productsQuery: PropTypes.object,
  productsCountQuery: PropTypes.object,
  addMutation: PropTypes.func,
  editMutation: PropTypes.func,
  removeMutation: PropTypes.func
};

export default compose(
  graphql(gql(queries.products), {
    name: 'productsQuery',
    options: () => ({
      variables: {
        // type: 'service',
        perPage: 5,
        page: 5
      },
      fetchPolicy: 'network-only'
    })
  }),
  graphql(gql(queries.productsCount), {
    name: 'productsCountQuery'
  }),
  graphql(gql(mutations.productAdd), {
    name: 'addMutation'
  }),
  graphql(gql(mutations.productEdit), {
    name: 'editMutation'
  }),
  graphql(gql(mutations.productRemove), {
    name: 'removeMutation'
  })
)(ProductListContainer);
