import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

import { DealContainer } from '../../styles';

const propTypes = {
  deal: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

class Deal extends React.Component {
  render() {
    const { deal, index } = this.props;

    return (
      <Draggable draggableId={deal._id} index={index}>
        {provided => (
          <div>
            <DealContainer
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {deal.customer.name}
              <br />
              {deal.amount}
            </DealContainer>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}

Deal.propTypes = propTypes;

export default Deal;
