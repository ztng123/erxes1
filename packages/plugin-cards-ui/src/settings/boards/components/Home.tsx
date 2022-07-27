import HeaderDescription from '@erxes/ui/src/components/HeaderDescription';
import { __ } from '@erxes/ui/src/utils/core';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import React from 'react';
import Boards from '../containers/Boards';
import Pipelines from '../containers/Pipelines';
import { IOption } from '../types';

type Props = {
  boardId: string;
  type: string;
  title: string;
  options?: IOption;
};

class Home extends React.Component<Props, {}> {
  render() {
    const { boardId, type, title, options } = this.props;

    const boardName = options ? options.boardName : 'Board';
    const pipelineName = options ? options.pipelineName : 'Pipeline';

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __(title), link: `/settings/boards/${type}` }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__(boardName)} breadcrumb={breadcrumb} />
        }
        mainHead={
          <HeaderDescription
            icon="/images/actions/34.svg"
            title={`${boardName} & ${pipelineName}`}
            description={`${__(
              "Manage your boards and pipelines so that its easy to manage incoming pop ups or requests that is adaptable to your team's needs"
            )}.${__(
              'Add in or delete boards and pipelines to keep business development on track and in check'
            )}`}
          />
        }
        leftSidebar={
          <Boards options={options} type={type} currentBoardId={boardId} />
        }
        content={<Pipelines options={options} type={type} boardId={boardId} />}
        hasBorder={true}
        transparent={true}
        noPadding
      />
    );
  }
}

export default Home;
