import client from 'apolloClient';
import gql from 'graphql-tag';
import { __, Alert, withProps } from 'modules/common/utils';
import { Stage } from 'modules/deals/components/stage';
import { mutations, queries } from 'modules/deals/graphql';
import {
  DealsQueryResponse,
  DealsTotalAmountsQueryResponse,
  IDeal,
  IDealParams,
  IStage,
  SaveDealMutation
} from 'modules/deals/types';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { PipelineConsumer } from '../PipelineContext';

type WrapperProps = {
  stage: IStage;
  index: number;
  loadingState: 'readyToLoad' | 'loaded';
  deals: IDeal[];
  length: number;
};

type StageProps = {
  onLoad: (stageId: string, deals: IDeal[]) => void;
  scheduleDeals: (stageId: string) => void;
  onAddDeal: (stageId: string, deal: IDeal) => void;
} & WrapperProps;

type FinalStageProps = {
  addMutation: SaveDealMutation;
  dealsQuery?: DealsQueryResponse;
  dealsTotalAmountsQuery: DealsTotalAmountsQueryResponse;
} & StageProps;

class StageContainer extends React.PureComponent<
  FinalStageProps,
  { loadedDeals: boolean }
> {
  componentWillReceiveProps(nextProps: FinalStageProps) {
    const { stage, loadingState, onLoad, dealsQuery } = nextProps;

    if (dealsQuery && !dealsQuery.loading && loadingState !== 'loaded') {
      onLoad(stage._id, dealsQuery.deals || []);
    }
  }

  componentDidMount() {
    const { scheduleDeals, stage } = this.props;

    scheduleDeals(stage._id);
  }

  loadMore = () => {
    const { onLoad, stage, deals } = this.props;

    client
      .query({
        query: gql(queries.deals),
        variables: {
          stageId: stage._id,
          skip: deals.length
        }
      })
      .then(({ data }: any) => {
        const dealIds = deals.map(deal => deal._id);
        const uniqueDeals = (data.deals || []).filter(
          deal => !dealIds.includes(deal._id)
        );
        onLoad(stage._id, [...deals, ...uniqueDeals]);
      });
  };

  // create deal
  addDeal = (name: string, callback: () => void) => {
    const { stage, onAddDeal, addMutation } = this.props;

    if (!stage) {
      return null;
    }

    return addMutation({ variables: { name, stageId: stage._id } })
      .then(({ data: { dealsAdd } }) => {
        Alert.success(__('Successfully saved.'));

        onAddDeal(stage._id, dealsAdd);

        callback();
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  render() {
    const {
      index,
      length,
      stage,
      deals,
      dealsQuery,
      dealsTotalAmountsQuery
    } = this.props;

    const loadingDeals = (dealsQuery ? dealsQuery.loading : null) || false;

    const dealAmount = dealsTotalAmountsQuery.dealsTotalAmounts || {
      dealCount: 0,
      dealAmounts: {}
    };

    return (
      <Stage
        stage={stage}
        index={index}
        length={length}
        deals={deals}
        loadingDeals={loadingDeals}
        dealAmount={dealAmount}
        loadMore={this.loadMore}
        addDeal={this.addDeal}
      />
    );
  }
}

const WithData = withProps<StageProps>(
  compose(
    graphql<StageProps>(gql(queries.dealsTotalAmounts), {
      name: 'dealsTotalAmountsQuery',
      options: ({ stage }) => ({
        variables: {
          stageId: stage._id
        }
      })
    }),
    graphql<StageProps>(gql(queries.deals), {
      name: 'dealsQuery',
      skip: ({ loadingState }) => loadingState !== 'readyToLoad',
      options: ({ stage }) => ({
        variables: {
          stageId: stage._id
        }
      })
    }),
    // mutation
    graphql<StageProps, SaveDealMutation, IDealParams>(
      gql(mutations.dealsAdd),
      {
        name: 'addMutation',
        options: ({ stage }) => ({
          refetchQueries: [
            {
              query: gql(queries.stageDetail),
              variables: { _id: stage && stage._id }
            }
          ]
        })
      }
    )
  )(StageContainer)
);

export default (props: WrapperProps) => {
  return (
    <PipelineConsumer>
      {({ onAddDeal, onLoadStage, scheduleDeals }) => {
        return (
          <WithData
            {...props}
            scheduleDeals={scheduleDeals}
            onLoad={onLoadStage}
            onAddDeal={onAddDeal}
          />
        );
      }}
    </PipelineConsumer>
  );
};
