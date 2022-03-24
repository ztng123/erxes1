import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { Bulk, Spinner } from '@erxes/ui/src/components';
import { Alert, withProps, router } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import List from '../components/List';
import { mutations, queries } from '../graphql';
import { queries as compaignQueries } from '../../../configs/voucherCompaign/graphql';
import { VoucherCompaignDetailQueryResponse } from '../../../configs/voucherCompaign/types';
import {
  MainQueryResponse,
  RemoveMutationResponse,
  RemoveMutationVariables
} from '../types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  vouchersMainQuery: MainQueryResponse;
  voucherCompaignDetailQuery: VoucherCompaignDetailQueryResponse;
} & Props &
  IRouterProps &
  RemoveMutationResponse;

type State = {
  loading: boolean;
};

class VoucherListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const {
      vouchersMainQuery,
      voucherCompaignDetailQuery,
      vouchersRemove,
      history
    } = this.props;

    if (vouchersMainQuery.loading || (voucherCompaignDetailQuery && voucherCompaignDetailQuery.loading)) {
      return <Spinner />;
    }

    const removeVouchers = ({ voucherIds }, emptyBulk) => {
      vouchersRemove({
        variables: { _ids: voucherIds }
      })
        .then(() => {
          emptyBulk();
          Alert.success('You successfully deleted a voucher');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';
    const { list = [], totalCount = 0 } = vouchersMainQuery.vouchersMain || {};
    const currentCompaign = voucherCompaignDetailQuery && voucherCompaignDetailQuery.voucherCompaignDetail;

    const updatedProps = {
      ...this.props,
      totalCount,
      searchValue,
      vouchers: list,
      currentCompaign,
      removeVouchers,
    };

    const vouchersList = props => {
      return <List {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.vouchersMainQuery.refetch();
    };

    return <Bulk content={vouchersList} refetch={refetch} />;
  }
}

const generateParams = ({ queryParams }) => ({
  ...router.generatePaginationParams(queryParams || {}),
  ids: queryParams.ids,
  compaignId: queryParams.compaignId,
  status: queryParams.status,
  ownerId: queryParams.ownerId,
  ownerType: queryParams.ownerType,
  searchValue: queryParams.searchValue,
  sortField: queryParams.sortField,
  sortDirection: parseInt(queryParams.sortDirection) || undefined
});

const generateOptions = () => ({
  refetchQueries: ['vouchersMain', 'voucherCounts', 'voucherCategories', 'voucherCategoriesTotalCount']
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, MainQueryResponse>(
      gql(queries.vouchersMain),
      {
        name: 'vouchersMainQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props, VoucherCompaignDetailQueryResponse>(
      gql(compaignQueries.voucherCompaignDetail),
      {
        name: 'voucherCompaignDetailQuery',
        options: ({ queryParams }) => ({
          variables: {
            _id: queryParams.compaignId
          }
        }),
        skip: ({ queryParams }) => !queryParams.compaignId,
      }
    ),
    // mutations
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.vouchersRemove),
      {
        name: 'vouchersRemove',
        options: generateOptions
      }
    ),
  )(withRouter<IRouterProps>(VoucherListContainer))
);
