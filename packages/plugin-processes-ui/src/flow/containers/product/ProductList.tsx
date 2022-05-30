import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import { Alert, withProps } from '@erxes/ui/src/utils';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import React from 'react';
import { graphql } from 'react-apollo';
import List from '../../components/product/ProductList';
import { mutations, queries } from '../../graphql';
import {
  CategoryDetailQueryResponse,
  jobRefersRemoveMutationResponse,
  jobReferTotalCountQueryResponse,
  FlowsQueryResponse
} from '../../types';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  flowsQuery: FlowsQueryResponse;
  jobRefersCountQuery: jobReferTotalCountQueryResponse;
  productCategoryDetailQuery: CategoryDetailQueryResponse;
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
      flowsQuery,
      jobRefersCountQuery,
      jobRefersRemove,
      queryParams,
      productCategoryDetailQuery,
      history
    } = this.props;

    if (flowsQuery.loading) {
      return false;
    }

    const flows = flowsQuery.flows || [];

    // remove action
    const remove = ({ jobRefersIds }, emptyBulk) => {
      jobRefersRemove({
        variables: { jobRefersIds }
      })
        .then(removeStatus => {
          emptyBulk();

          const status = removeStatus.data.productsRemove;

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
      flows,
      remove,
      loading: flowsQuery.loading,
      searchValue,
      jobRefersCount: jobRefersCountQuery.jobReferTotalCount || 0,
      currentCategory: productCategoryDetailQuery.productCategoryDetail || {}
    };

    const jobReferList = props => {
      return <List {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.flowsQuery.refetch();
    };

    return <Bulk content={jobReferList} refetch={refetch} />;
  }
}

const getRefetchQueries = () => {
  return [
    'flows',
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
    graphql<Props, FlowsQueryResponse, { page: number; perPage: number }>(
      gql(queries.flows),
      {
        name: 'flowsQuery',
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
        options: () => ({
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
    ),
    graphql<Props, CategoryDetailQueryResponse>(
      gql(queries.productCategoryDetail),
      {
        name: 'productCategoryDetailQuery',
        options: ({ queryParams }) => ({
          variables: {
            _id: queryParams.categoryId
          }
        })
      }
    )
  )(ProductListContainer)
);
