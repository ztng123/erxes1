import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import gql from 'graphql-tag';
import List from '../../components/refer/List';
import React from 'react';
import { Alert, withProps } from '@erxes/ui/src/utils';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { graphql } from 'react-apollo';
import {
  JobRefersQueryResponse,
  jobRefersRemoveMutationResponse,
  jobReferTotalCountQueryResponse
} from '../../types';
import { mutations, queries } from '../../graphql';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  jobRefersQuery: JobRefersQueryResponse;
  jobRefersCountQuery: jobReferTotalCountQueryResponse;
} & Props &
  jobRefersRemoveMutationResponse;

class ProductListContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);

    this.state = {
      mergeProductLoading: false
    };
  }

  render() {
    const {
      jobRefersQuery,
      jobRefersCountQuery,
      jobRefersRemove,
      queryParams
    } = this.props;

    if (jobRefersQuery.loading) {
      return false;
    }

    const jobRefers = jobRefersQuery.jobRefers || [];

    // remove action
    const remove = ({ jobRefersIds }, emptyBulk) => {
      jobRefersRemove({
        variables: { jobRefersIds }
      })
        .then(removeStatus => {
          emptyBulk();

          const status = removeStatus.data.jobRefersRemove;

          status === 'deleted'
            ? Alert.success('You successfully deleted a job')
            : Alert.warning('Job status deleted');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';

    const updatedProps = {
      ...this.props,
      queryParams,
      jobRefers,
      remove,
      loading: jobRefersQuery.loading,
      searchValue,
      jobRefersCount: jobRefersCountQuery.jobReferTotalCount || 0
    };

    const jobReferList = props => {
      return <List {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.jobRefersQuery.refetch();
    };

    return <Bulk content={jobReferList} refetch={refetch} />;
  }
}

const getRefetchQueries = () => {
  return [
    'jobRefers',
    'jobCategories',
    'jobCategoriesTotalCount',
    'jobReferTotalCount',
    'productCountByTags'
  ];
};

const options = () => ({
  refetchQueries: getRefetchQueries()
});

export default withProps<Props>(
  compose(
    graphql<Props, JobRefersQueryResponse, { page: number; perPage: number }>(
      gql(queries.jobRefers),
      {
        name: 'jobRefersQuery',
        options: ({ queryParams }) => ({
          variables: {
            categoryId: queryParams.categoryId,
            searchValue: queryParams.searchValue,
            ...generatePaginationParams(queryParams)
          },
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props, jobReferTotalCountQueryResponse>(
      gql(queries.jobReferTotalCount),
      {
        name: 'jobRefersCountQuery',
        options: ({ queryParams }) => ({
          variables: {
            categoryId: queryParams.categoryId,
            searchValue: queryParams.searchValue
          },
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props, jobRefersRemoveMutationResponse, { jobRefersIds: string[] }>(
      gql(mutations.jobRefersRemove),
      {
        name: 'jobRefersRemove',
        options
      }
    )
  )(ProductListContainer)
);
