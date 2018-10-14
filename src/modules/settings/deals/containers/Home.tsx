import gql from 'graphql-tag';
import { Spinner } from 'modules/common/components';
import { IRouterProps } from 'modules/common/types';
import { router as routerUtils } from 'modules/common/utils';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { Home } from '../components';
import { queries } from '../graphql';

type HomeContainerProps = {
  history?: any;
  boardId: string;
  boardName: string;
};

class HomeContainer extends React.Component<HomeContainerProps> {
  componentWillReceiveProps(nextProps) {
    const { history, boardId, boardName } = nextProps;

    if (!routerUtils.getParam(history, 'boardId') && boardId) {
      routerUtils.setParams(history, { boardId });
      routerUtils.setParams(history, { boardName });
    }
  }

  render() {
    return <Home {...this.props} />;
  }
}

type LastBoardProps = {
  boardGetLastQuery: any;
};

// Getting lastBoard id to currentBoard
const LastBoard = (props: LastBoardProps) => {
  const { boardGetLastQuery } = props;

  if (boardGetLastQuery.loading) {
    return <Spinner objective />;
  }

  const lastBoard = boardGetLastQuery.dealBoardGetLast || {};

  const extendedProps = {
    ...props,
    boardId: lastBoard._id,
    boardName: lastBoard.name
  };

  return <HomeContainer {...extendedProps} />;
};

const LastBoardContainer = compose(
  graphql(gql(queries.boardGetLast), {
    name: 'boardGetLastQuery'
  })
)(LastBoard);

// Main home component
const MainContainer = (props: IRouterProps) => {
  const { history } = props;
  const boardId = routerUtils.getParam(history, 'boardId');
  const boardName = routerUtils.getParam(history, 'boardName');

  if (boardId) {
    const extendedProps = { ...props, boardId, boardName };

    return <HomeContainer {...extendedProps} />;
  }

  return <LastBoardContainer {...props} />;
};

export default withRouter<IRouterProps>(MainContainer);
