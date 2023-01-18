import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import ListComponent from '../components/List';
import { withProps } from '@erxes/ui/src/utils/core';
import { mutations, queries } from '../graphql';
import { Spinner, confirm, Alert } from '@erxes/ui/src';
import { IRouterProps } from '@erxes/ui/src/types';
import { generateParams, refetchQueries } from '../common/utils';
type Props = {
  queryParams: any;
} & IRouterProps;

type FinalProps = {
  listQuery: any;
  totalCountQuery: any;
  removeOperations: any;
} & Props;

class List extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { listQuery, totalCountQuery } = this.props;

    if (listQuery.loading) {
      return <Spinner />;
    }

    const remove = (ids: string[]) => {
      const { removeOperations } = this.props;
      confirm().then(() => {
        removeOperations({ variables: { ids } }).then(() => {
          Alert.success('Removed successfully');
        });
      });
    };

    const updateProps = {
      ...this.props,
      list: listQuery.operations,
      totalCount: totalCountQuery.operationsTotalCount,
      loading: listQuery.loading,
      remove
    };

    return <ListComponent {...updateProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.operations), {
      name: 'listQuery',
      options: ({ queryParams }) => ({
        variables: generateParams(queryParams)
      })
    }),
    graphql<Props>(gql(queries.operationsTotalCount), {
      name: 'totalCountQuery',
      options: ({ queryParams }) => ({
        variables: generateParams(queryParams)
      })
    }),
    graphql<Props>(gql(mutations.removeOperations), {
      name: 'removeOperations',
      options: ({ queryParams }) => ({
        refetchQueries: refetchQueries(queryParams)
      })
    })
  )(List)
);
