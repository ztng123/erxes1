import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Draggable } from 'react-beautiful-dnd';
import { ItemCounter, UserCounter, QuickEdit } from '../';
import { Icon } from 'modules/common/components';
import {
  DealContainer,
  DealContainerHover,
  DealDate,
  DealAmount
} from '../../styles';

const propTypes = {
  deal: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  saveDeal: PropTypes.func.isRequired,
  removeDeal: PropTypes.func.isRequired,
  moveDeal: PropTypes.func.isRequired
};

class Deal extends React.Component {
  constructor(props) {
    super(props);

    this.showQuickEditForm = this.showQuickEditForm.bind(this);
    this.closeQuickEditForm = this.closeQuickEditForm.bind(this);

    this.state = {
      showQuickEdit: false,
      top: 0,
      left: 0,
      bottom: 0
    };
  }

  closeQuickEditForm() {
    this.setState({ showQuickEdit: false });
  }

  showQuickEditForm() {
    const info = this.hover.getBoundingClientRect();

    let top = info.top;

    this.setState({
      showQuickEdit: true,
      top,
      left: info.left
    });
  }

  renderProducts(products) {
    return <ItemCounter items={products} />;
  }

  renderUsers(users) {
    return <UserCounter users={users} />;
  }

  renderAmount(amount) {
    if (Object.keys(amount).length === 0) return null;

    return (
      <DealAmount>
        {Object.keys(amount).map(key => (
          <p key={key}>
            {amount[key].toLocaleString()} <span>{key}</span>
          </p>
        ))}
      </DealAmount>
    );
  }

  render() {
    const { deal, saveDeal, removeDeal, moveDeal, index } = this.props;

    if (this.state.showQuickEdit) {
      const { top, bottom, left } = this.state;

      return (
        <QuickEdit
          top={top}
          bottom={bottom}
          left={left}
          close={this.closeQuickEditForm}
          deal={deal}
          saveDeal={saveDeal}
          removeDeal={removeDeal}
          moveDeal={moveDeal}
        />
      );
    }

    return (
      <Draggable draggableId={deal._id} index={index}>
        {(provided, snapshot) => {
          const products = deal.products.map(p => p.product);

          return (
            <div>
              <DealContainer
                innerRef={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
              >
                <DealDate>
                  {moment(deal.closeDate).format('YYYY-MM-DD')}
                </DealDate>

                {this.renderProducts(products)}

                {this.renderAmount(deal.amount || {})}

                {this.renderUsers(deal.assignedUsers || [])}

                <DealContainerHover innerRef={el => (this.hover = el)}>
                  <div onClick={this.showQuickEditForm}>
                    <Icon icon="edit" />
                  </div>
                </DealContainerHover>
              </DealContainer>
              {provided.placeholder}
            </div>
          );
        }}
      </Draggable>
    );
  }
}

Deal.propTypes = propTypes;

export default Deal;
