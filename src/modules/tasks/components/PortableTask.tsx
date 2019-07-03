import { Details, UserCounter } from 'modules/boards/components/portable';
import { EditForm } from 'modules/boards/containers/editForm';
import { ItemContainer } from 'modules/boards/styles/common';
import {
  Footer,
  PriceContainer,
  Right,
  SpaceContent
} from 'modules/boards/styles/item';
import { Content } from 'modules/boards/styles/stage';
import { IOptions } from 'modules/boards/types';
import { renderDate } from 'modules/boards/utils';
import { ModalTrigger } from 'modules/common/components';
import { __ } from 'modules/common/utils';
import React from 'react';
import { ITask } from '../types';

type Props = {
  item: ITask;
  onAdd?: (stageId: string, item: ITask) => void;
  onRemove?: (dealId: string, stageId: string) => void;
  onUpdate?: (item: ITask) => void;
  options: IOptions;
};

class Task extends React.Component<Props, { isFormVisible: boolean }> {
  renderFormTrigger = (trigger: React.ReactNode) => {
    const { item, onAdd, onRemove, onUpdate, options } = this.props;

    const content = props => (
      <EditForm
        {...props}
        options={options}
        stageId={item.stageId}
        itemId={item._id}
        onAdd={onAdd}
        onRemove={onRemove}
        onUpdate={onUpdate}
      />
    );

    return (
      <ModalTrigger
        title="Edit task"
        trigger={trigger}
        size="lg"
        content={content}
      />
    );
  };

  render() {
    const { item } = this.props;

    const content = (
      <ItemContainer>
        <Content>
          <SpaceContent>
            <h5>{item.name}</h5>
            {renderDate(item.closeDate)}
          </SpaceContent>
          <Details color="#F7CE53" items={item.customers || []} />
          <Details color="#EA475D" items={item.companies || []} />
        </Content>
        <PriceContainer>
          <Right>
            <UserCounter users={item.assignedUsers || []} />
          </Right>
        </PriceContainer>

        <Footer>
          {__('Last updated')}:<Right>{renderDate(item.modifiedAt)}</Right>
        </Footer>
      </ItemContainer>
    );

    return this.renderFormTrigger(content);
  }
}

export default Task;
