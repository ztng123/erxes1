import gql from 'graphql-tag';
import { EmptyState, Spinner } from 'modules/common/components';
import { withProps } from 'modules/common/utils';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { queries } from '../graphql';
import { PipelineDetailQueryResponse } from '../types';
import Pipeline from './Pipeline';

type Props = {
  queryParams: any;
};

type FinalProps = {
  pipelineDetailQuery: PipelineDetailQueryResponse;
} & Props;

const WithPipelinesQuery = (props: FinalProps) => {
  const { pipelineDetailQuery } = props;

  if (!pipelineDetailQuery) {
    return (
      <EmptyState
        image="/images/actions/19.svg"
        text="Oh boy, looks like you need to get a head start on your deals"
        size="small"
      />
    );
  }

  if (pipelineDetailQuery.loading) {
    return null;
  }

  const pipeline = pipelineDetailQuery.dealPipelineDetail;

  return <Pipeline pipeline={pipeline} key={pipeline._id} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, PipelineDetailQueryResponse, { _id?: string }>(
      gql(queries.pipelineDetail),
      {
        name: 'pipelineDetailQuery',
        skip: ({ queryParams }) => !queryParams.pipelineId,
        options: ({ queryParams }) => ({
          variables: { _id: queryParams && queryParams.pipelineId }
        })
      }
    )
  )(WithPipelinesQuery)
);
