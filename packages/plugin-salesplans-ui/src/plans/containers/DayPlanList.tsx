import * as compose from 'lodash.flowright';
import DayPlans from '../components/DayPlanList';
import gql from 'graphql-tag';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import { Alert, router, withProps } from '@erxes/ui/src/utils';
import { Bulk } from '@erxes/ui/src/components';
import {
  DayPlansConfirmMutationResponse,
  DayPlansCountQueryResponse,
  DayPlansEditMutationResponse,
  DayPlansQueryResponse,
  DayPlansRemoveMutationResponse,
  IDayPlan,
  IDayPlanConfirmParams
} from '../types';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';
import { queries as timeFrameQueries } from '../../settings/graphql';
import { TimeframeQueryResponse } from '../../settings/types';
import {} from '../types';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  dayPlanQuery: DayPlansQueryResponse;
  dayPlansCountQuery: DayPlansCountQueryResponse;
  timeFrameQuery: TimeframeQueryResponse;
} & Props &
  DayPlansEditMutationResponse &
  DayPlansRemoveMutationResponse &
  DayPlansConfirmMutationResponse;

class DayPlansContainer extends React.Component<FinalProps> {
  render() {
    const {
      dayPlanQuery,
      dayPlansCountQuery,
      queryParams,
      timeFrameQuery,
      dayPlanEdit,
      dayPlansRemove,
      dayPlansConfirm
    } = this.props;

    if (
      dayPlanQuery.loading ||
      dayPlansCountQuery.loading ||
      timeFrameQuery.loading
    ) {
      return <Spinner />;
    }

    // edit row action
    const edit = (doc: IDayPlan) => {
      dayPlanEdit({
        variables: { ...doc }
      })
        .then(() => {
          Alert.success('You successfully updated a census');
          dayPlanQuery.refetch();
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    // remove action
    const remove = ({ dayPlanIds }, emptyBulk) => {
      dayPlansRemove({
        variables: { _ids: dayPlanIds }
      })
        .then(removeStatus => {
          emptyBulk();

          removeStatus.data.dayPlansRemove.deletedCount
            ? Alert.success('You successfully deleted a product')
            : Alert.warning('Product status deleted');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    // confirm action
    const toConfirm = (doc: IDayPlanConfirmParams, callback?: () => void) => {
      dayPlansConfirm({
        variables: { ...doc }
      })
        .then(() => {
          if (callback) {
            callback();
          }

          Alert.success('You successfully confirmed');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const timeFrames = timeFrameQuery.timeframes || [];
    const searchValue = this.props.queryParams.searchValue || '';
    const dayPlans = dayPlanQuery.dayPlans || [];
    const totalCount = dayPlansCountQuery.dayPlansCount || 0;

    const updatedProps = {
      ...this.props,
      queryParams,
      dayPlans,
      totalCount,
      timeFrames,
      edit,
      remove,
      toConfirm,
      searchValue
    };

    const dayPlanList = props => <DayPlans {...updatedProps} {...props} />;

    const refetch = () => {
      this.props.dayPlanQuery.refetch();
    };

    return <Bulk content={dayPlanList} refetch={refetch} />;
  }
}

const getRefetchQueries = () => {
  return ['dayPlans', 'dayPlansCount'];
};

const options = () => ({
  refetchQueries: getRefetchQueries()
});

const generateParams = ({ queryParams }) => ({
  ...router.generatePaginationParams(queryParams || {}),
  _ids: queryParams._ids,
  searchValue: queryParams.searchValue,
  date: new Date(queryParams.date),
  filterStatus: queryParams.filterStatus,
  departmentId: queryParams.departmentId,
  branchId: queryParams.branchId,
  productId: queryParams.productId,
  productCategoryId: queryParams.productCategoryId,
  minValue: queryParams.minValue,
  maxValue: queryParams.maxValue,
  dateType: queryParams.dateType,
  startDate: queryParams.startDate,
  endDate: queryParams.endDate
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, DayPlansQueryResponse>(
      gql(queries.dayPlans),
      {
        name: 'dayPlanQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<{ queryParams: any }, DayPlansCountQueryResponse>(
      gql(queries.dayPlansCount),
      {
        name: 'dayPlansCountQuery',
        options: ({ queryParams }) => ({
          variables: generateParams({ queryParams }),
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<{}, TimeframeQueryResponse>(gql(timeFrameQueries.timeframes), {
      name: 'timeFrameQuery'
    }),
    graphql<Props, DayPlansEditMutationResponse, {}>(
      gql(mutations.dayPlanEdit),
      {
        name: 'dayPlanEdit'
      }
    ),
    graphql<Props, DayPlansRemoveMutationResponse, { dayPlanIds: string[] }>(
      gql(mutations.dayPlansRemove),
      {
        name: 'dayPlansRemove',
        options
      }
    ),
    graphql<Props, DayPlansConfirmMutationResponse, {}>(
      gql(mutations.dayPlansConfirm),
      {
        name: 'dayPlansConfirm',
        options
      }
    )
  )(DayPlansContainer)
);
