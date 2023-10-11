import { IOptions, IStage } from '../../boards/types';
import { PriceContainer, Right, Status } from '../../boards/styles/item';
import {
  renderAmount,
  renderPercentedAmount,
  renderPriority
} from '../../boards/utils';

import Assignees from '../../boards/components/Assignees';
import { Content } from '../../boards/styles/stage';
import Details from '../../boards/components/Details';
import DueDateLabel from '../../boards/components/DueDateLabel';
import EditForm from '../../boards/containers/editForm/EditForm';
import { Flex } from '@erxes/ui/src/styles/main';
import { IDeal } from '../types';
import ItemArchivedStatus from '../../boards/components/portable/ItemArchivedStatus';
import { ItemContainer } from '../../boards/styles/common';
import ItemFooter from '../../boards/components/portable/ItemFooter';
import Labels from '../../boards/components/label/Labels';
import React from 'react';
import { StageInfo } from '../../boards/styles/stage';
import { __ } from '@erxes/ui/src/utils';
import { colors } from '@erxes/ui/src/styles';

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
    const { item } = this.props;

    return (
      <Status>
        <span style={{ backgroundColor: color }}>{__(text)}</span>
        <ItemArchivedStatus
          status={item.status || 'active'}
          skipContainer={true}
        />
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

    const renderProduct = p => {
      const data: any = { ...p.product };
      data.quantity = p.quantity;
      data.uom = p.uom;

      return data;
    };

    const products = (item.products || [])
      .filter(p => p.tickUsed)
      .map(p => renderProduct(p));

    const exProducts = (item.products || [])
      .filter(p => !p.tickUsed)
      .map(p => renderProduct(p));

    const {
      customers,
      companies,
      startDate,
      closeDate,
      isComplete,
      stage = {} as IStage,
      customProperties
    } = item;

    const probability =
      stage.probability === 'Won'
        ? '100%'
        : stage.probability === 'Lost'
        ? '0%'
        : stage.probability;

    const forecast = () => {
      if (!probability) {
        return null;
      }

      return (
        <Flex>
          <span>Forecasted ({probability}):</span>{' '}
          {renderPercentedAmount(item.amount, parseInt(probability, 10))}
        </Flex>
      );
    };

    const total = () => {
      if (Object.keys(item.amount).length === 0) {
        return null;
      }

      return (
        <Flex>
          <span>Total:</span> {renderAmount(item.amount)}
        </Flex>
      );
    };

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
        <Details
          color={colors.colorCoreOrange}
          items={customProperties || []}
        />

        <PriceContainer>
          <StageInfo>
            {total()}
            {forecast()}
          </StageInfo>

          <Right>
            <Assignees users={item.assignedUsers} />
          </Right>
        </PriceContainer>

        <DueDateLabel
          startDate={startDate}
          closeDate={closeDate}
          isComplete={isComplete}
        />

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
