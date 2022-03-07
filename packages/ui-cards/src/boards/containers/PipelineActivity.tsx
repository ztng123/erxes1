import * as compose from 'lodash.flowright';

import React from 'react';
import {
  IPipeline,
  ActivityLogsByActionQueryResponse,
  IOptions,
  InternalNotesByActionQueryResponse
} from '../types';
import gql from 'graphql-tag';
import { withProps } from '@erxes/ui/src/utils';
import { graphql } from 'react-apollo';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { queries } from '../graphql';
import ActivityLogs from '../components/activityLogs/ActivityLogs';

type Props = {
  pipeline: IPipeline;
  queryParams: any;
  options: IOptions;
};

type WithStagesProps = {
  activityLogsByActionQuery: ActivityLogsByActionQueryResponse;
  internalNotesByActionQuery: InternalNotesByActionQueryResponse;
} & Props;

const buildListAndCount = (props: WithStagesProps) => {
  const { queryParams, activityLogsByActionQuery, internalNotesByActionQuery } = props;
  const { action = '' } = queryParams;

  const { activityLogsByAction } = activityLogsByActionQuery;

  if (activityLogsByActionQuery.loading || internalNotesByActionQuery.loading) {
    return { list: [], totalCount: 0 };
  }

  let list = activityLogsByAction.activityLogs || [];
  let totalCount = activityLogsByAction.totalCount || 0;
  const actionList = action.split(',');

  if (actionList.includes('addNote')) {
    list = list.concat(internalNotesByActionQuery.internalNotesByAction.list);
    totalCount += internalNotesByActionQuery.internalNotesByAction.totalCount;
  }

  list.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return { list, totalCount };
}

const ActivityList = (props: WithStagesProps) => {
  const { queryParams, activityLogsByActionQuery } = props;

  const { error, loading } = activityLogsByActionQuery;

  const { list, totalCount } = buildListAndCount(props);

  const updatedProps = {
    ...props,
    isLoading: loading,
    refetchQueries: commonOptions(queryParams),
    activityLogsByAction: list,
    count: totalCount,
    errorMessage: error || ''
  };

  return <ActivityLogs {...updatedProps} />;
};

const commonOptions = queryParams => {
  const variables = {
    action: queryParams.action,
    contentType: queryParams.type,
    ...generatePaginationParams(queryParams)
  };

  return [{ query: gql(queries.activityLogsByAction), variables }];
};

const commonParams = (queryParams, options) => ({
  contentType: options.type,
  pipelineId: queryParams.pipelineId,
  page: parseInt(queryParams.page || '1', 10),
  perPage: parseInt(queryParams.perPage || '10', 10)
});

export default withProps<Props>(
  compose(
    graphql<Props, ActivityLogsByActionQueryResponse>(
      gql(queries.activityLogsByAction),
      {
        name: 'activityLogsByActionQuery',
        options: ({ queryParams, options }) => ({
          variables: {
            ...commonParams(queryParams, options),
            action: queryParams.action,
          }
        })
      }
    ),
    graphql<Props>(gql(queries.internalNotesByAction), {
      name: 'internalNotesByActionQuery',
      options: ({ queryParams, options }) => ({
        variables: {
          ...commonParams(queryParams, options)
        }
      })
    })
  )(ActivityList)
);
