import dayjs from 'dayjs';
import DueDateLabel from 'modules/boards/components/DueDateLabel';
import EditForm from 'modules/boards/containers/editForm/EditForm';
import { ItemDate } from 'modules/boards/styles/common';
import { Footer, PriceContainer, Right } from 'modules/boards/styles/item';
import { Content, ItemIndicator } from 'modules/boards/styles/stage';
import { IOptions } from 'modules/boards/types';
import { renderAmount } from 'modules/boards/utils';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import routerUtils from 'modules/common/utils/router';
import Participators from 'modules/inbox/components/conversationDetail/workarea/Participators';
import queryString from 'query-string';
import React from 'react';
import history from '../../../browserHistory';
import { IDeal } from '../types';

type Props = {
  stageId: string;
  item: IDeal;
  beforePopupClose: () => void;
  onClick: () => void;
  options?: IOptions;
};

class DealItem extends React.PureComponent<Props, { isFormVisible: boolean }> {
  unlisten?: () => void;

  constructor(props) {
    super(props);

    const { item } = props;

    const itemIdQueryParam = routerUtils.getParam(history, 'itemId');

    let isFormVisible = false;

    if (itemIdQueryParam === item._id || props.isPopupVisible) {
      isFormVisible = true;
    }

    this.state = {
      isFormVisible
    };
  }

  componentDidMount() {
    this.unlisten = history.listen(location => {
      const queryParams = queryString.parse(location.search);

      if (queryParams.itemId === this.props.item._id) {
        return this.setState({ isFormVisible: true });
      }
    });
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  renderDate(date) {
    if (!date) {
      return null;
    }

    return <ItemDate>{dayjs(date).format('MMM D, h:mm a')}</ItemDate>;
  }

  renderForm = () => {
    const { stageId, item, options, beforePopupClose } = this.props;

    if (!this.state.isFormVisible) {
      return null;
    }

    const beforePopupCloseCb = () => {
      this.setState({ isFormVisible: false }, () => {
        const itemIdQueryParam = routerUtils.getParam(history, 'itemId');

        if (itemIdQueryParam) {
          routerUtils.removeParams(history, 'itemId');
        }

        beforePopupClose();
      });
    };

    return (
      <EditForm
        beforePopupClose={beforePopupCloseCb}
        isPopupVisible={this.state.isFormVisible}
        options={options}
        stageId={stageId}
        itemId={item._id}
        hideHeader={true}
      />
    );
  };

  render() {
    const { item, onClick } = this.props;
    const products = (item.products || []).map(p => p.product);
    const { customers, companies, closeDate, isComplete } = item;

    return (
      <>
        <Content onClick={onClick}>
          <h5>{item.name}</h5>

          {products.map((product, index) => (
            <div key={index}>
              <ItemIndicator color="#63D2D6" />
              {product.name}
            </div>
          ))}

          {customers.map((customer, index) => (
            <div key={index}>
              <ItemIndicator color="#F7CE53" />
              {customer.firstName || customer.primaryEmail}
            </div>
          ))}

          {companies.map((company, index) => (
            <div key={index}>
              <ItemIndicator color="#EA475D" />
              {company.primaryName}
            </div>
          ))}

          <PriceContainer>
            {renderAmount(item.amount)}

            <Right>
              <Participators participatedUsers={item.assignedUsers} limit={3} />
            </Right>
          </PriceContainer>

          <DueDateLabel closeDate={closeDate} isComplete={isComplete} />

          <Footer>
            {item.isWatched ? <Icon icon="eye" /> : __('Last updated')}
            <Right>{this.renderDate(item.modifiedAt)}</Right>
          </Footer>
        </Content>

        {this.renderForm()}
      </>
    );
  }
}

export default DealItem;
