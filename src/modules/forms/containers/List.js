import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Bulk } from 'modules/common/components';
import { queries, mutations } from '../graphql';
import { List } from '../components';

class ListContainer extends Bulk {
  render() {
    const {
      integrationsQuery,
      integrationsCountQuery,
      usersQuery,
      tagsQuery,
      removeMutation
    } = this.props;

    const integrationsCount =
      integrationsCountQuery.integrationsTotalCount || 0;
    const integrations = integrationsQuery.integrations || [];
    const members = usersQuery.users || [];

    const remove = (_id, callback) => {
      removeMutation({
        variables: { _id }
      }).then(() => {
        // refresh queries
        integrationsQuery.refetch();
        integrationsCountQuery.refetch();

        callback();
      });
    };

    const updatedProps = {
      ...this.props,
      integrations,
      integrationsCount,
      members,
      remove,
      loading: integrationsQuery.loading,
      bulk: this.state.bulk || [],
      emptyBulk: this.emptyBulk,
      toggleBulk: this.toggleBulk,
      tags: tagsQuery.tags || []
    };

    return <List {...updatedProps} />;
  }
}

ListContainer.propTypes = {
  integrationsCountQuery: PropTypes.object,
  integrationsQuery: PropTypes.object,
  usersQuery: PropTypes.object,
  tagsQuery: PropTypes.object,
  removeMutation: PropTypes.func
};

export default compose(
  graphql(gql(queries.integrations), {
    name: 'integrationsQuery',
    options: ({ queryParams }) => {
      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          page: queryParams.page,
          perPage: queryParams.perPage || 20,
          tag: queryParams.tag,
          kind: 'form'
        },
        fetchPolicy: 'network-only'
      };
    }
  }),
  graphql(gql(queries.integrationsCount), {
    name: 'integrationsCountQuery',
    options: () => {
      return {
        variables: { kind: 'form' },
        fetchPolicy: 'network-only'
      };
    }
  }),
  graphql(gql(queries.users), {
    name: 'usersQuery'
  }),
  graphql(gql(queries.tags), {
    name: 'tagsQuery',
    options: () => ({
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        type: 'form'
      }
    })
  }),
  graphql(gql(mutations.integrationRemove), {
    name: 'removeMutation'
  })
)(ListContainer);
