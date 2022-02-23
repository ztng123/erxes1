import Assignees from '@erxes/ui-cards/src/boards/components/Assignees';
import Details from '@erxes/ui-cards/src/boards/components/Details';
import DueDateLabel from '@erxes/ui-cards/src/boards/components/DueDateLabel';
import Labels from '@erxes/ui-cards/src/boards/components/label/Labels';
import ItemFooter from '@erxes/ui-cards/src/boards/components/portable/ItemFooter';
import EditForm from '@erxes/ui-cards/src/boards/containers/editForm/EditForm';
import { ItemContainer } from '@erxes/ui-cards/src/boards/styles/common';
import {
  PriceContainer,
  Right,
  Status
} from '@erxes/ui-cards/src/boards/styles/item';
import { Content } from '@erxes/ui-cards/src/boards/styles/stage';
import { IOptions } from '@erxes/ui-cards/src/boards/types';
import { renderAmount, renderPriority } from '@erxes/ui-cards/src/boards/utils';
import { colors } from '@erxes/ui/src/styles';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import { IDeal } from '../types';

type Props = {
  stageId?: string;
  item: IDeal;
  beforePopupClose?: () => void;
  onClick?: () => void;
  options?: IOptions;
  isFormVisible?: boolean;
  portable?: boolean;
  onAdd?: (stageId: string, item: IDeal) => void;
  onRemove?: (dealId: string, stageId: string) => void;
  onUpdate?: (item: IDeal) => void;
};

class DealItem extends React.PureComponent<Props> {
  renderForm = () => {
    const { stageId, item, isFormVisible } = this.props;

    if (!isFormVisible) {
      return null;
    }

    return (
      <EditForm
        {...this.props}
        stageId={stageId || item.stageId}
        itemId={item._id}
        hideHeader={true}
        isPopupVisible={isFormVisible}
      />
    );
  };

  renderStatusLabel(text, color) {
    return (
      <Status>
        <span style={{ backgroundColor: color }}>{__(text)}</span>
      </Status>
    );
  }

  renderStatus(stage) {
    if (!stage) {
      return null;
    }

    if (stage.probability === 'Lost') {
      return this.renderStatusLabel('Lost', colors.colorCoreRed);
    }

    if (stage.probability === 'Won') {
      return this.renderStatusLabel('Won', colors.colorCoreGreen);
    }

    return this.renderStatusLabel('In Progress', colors.colorCoreBlue);
  }

  renderContent() {
    const { item } = this.props;

    const products = (item.products || [])
      .filter(p => p.tickUsed)
      .map(p => p.product);

    const exProducts = (item.products || [])
      .filter(p => !p.tickUsed)
      .map(p => p.product);

    const { customers, companies, closeDate, isComplete } = item;

    return (
      <>
        <h5>
          {renderPriority(item.priority)}
          {item.name}
        </h5>

        <Details color="#63D2D6" items={products} />
        <Details color="#b49cf1" items={exProducts} />
        <Details color="#F7CE53" items={customers || []} />
        <Details color="#EA475D" items={companies || []} />

        <PriceContainer>
          {renderAmount(item.amount)}

          <Right>
            <Assignees users={item.assignedUsers} />
          </Right>
        </PriceContainer>

        <DueDateLabel closeDate={closeDate} isComplete={isComplete} />

        <ItemFooter item={item} />
      </>
    );
  }

  render() {
    const { item, portable, onClick } = this.props;

    if (portable) {
      return (
        <>
          <ItemContainer onClick={onClick}>
            {this.renderStatus(item.stage)}
            <Content>{this.renderContent()}</Content>
          </ItemContainer>
          {this.renderForm()}
        </>
      );
    }

    return (
      <>
        <Labels labels={item.labels} indicator={true} />
        <Content onClick={onClick}>{this.renderContent()}</Content>
        {this.renderForm()}
      </>
    );
  }
}

export default DealItem;
