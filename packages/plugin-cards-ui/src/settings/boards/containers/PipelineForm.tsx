import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import {
  BoardsQueryResponse,
  StagesQueryResponse
} from '@erxes/ui-cards/src/boards/types';
import { IPipeline } from '@erxes/ui-cards/src/boards/types';
import Spinner from '@erxes/ui/src/components/Spinner';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import PipelineForm from '../components/PipelineForm';
import { queries } from '@erxes/ui-settings/src/boards/graphql';
import { IOption } from '../types';

type Props = {
  pipeline?: IPipeline;
  boardId?: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  show: boolean;
  type: string;
  options?: IOption;
};

type FinalProps = {
  stagesQuery: StagesQueryResponse;
  boardsQuery: BoardsQueryResponse;
} & Props;

class PipelineFormContainer extends React.Component<FinalProps> {
  render() {
    const {
      stagesQuery,
      boardsQuery,
      boardId,
      renderButton,
      options
    } = this.props;

    if (
      (stagesQuery && stagesQuery.loading) ||
      (boardsQuery && boardsQuery.loading)
    ) {
      return <Spinner />;
    }

    const stages = stagesQuery ? stagesQuery.stages : [];
    const boards = boardsQuery.boards || [];

    const extendedProps = {
      ...this.props,
      stages,
      boards,
      boardId,
      renderButton
    };

    const Form = options ? options.PipelineForm : PipelineForm;

    return <Form {...extendedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, StagesQueryResponse, { pipelineId: string }>(
      gql(queries.stages),
      {
        name: 'stagesQuery',
        skip: props => !props.pipeline,
        options: ({ pipeline }: { pipeline?: IPipeline }) => ({
          variables: { pipelineId: pipeline ? pipeline._id : '', isAll: true },
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props, BoardsQueryResponse, {}>(gql(queries.boards), {
      name: 'boardsQuery',
      options: ({ type }) => ({
        variables: { type }
      })
    })
  )(PipelineFormContainer)
);
