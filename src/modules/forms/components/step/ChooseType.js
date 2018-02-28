import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexItem, Divider } from './style';
import styled from 'styled-components';
import { dimensions, colors } from 'modules/common/styles';
import { rgba } from 'modules/common/styles/color';

const BoxContainer = FlexItem.extend`
  min-width: 500px;
  padding: 0 20px;
  > div {
    max-height: 100%;
    width: 420px;
  }
`;

const Preview = FlexItem.extend`
  flex: 1 100%;
  background: ${colors.bgMain};
`;

const Box = styled.div`
  display: inline-block;
  text-align: center;
  background: ${colors.colorLightBlue};
  box-shadow: 0 8px 5px ${rgba(colors.colorCoreGray, 0.08)};
  border-radius: ${dimensions.unitSpacing / 2}px;
  padding: ${dimensions.headerSpacing - 5}px;
  transition: all 0.25s ease;
  width: 200px;
  margin-top: 20px;

  &:nth-child(2n) {
    margin-left: 20px;
  }

  &:last-child {
    margin-bottom: 20px;
  }

  img {
    width: 75px;
    transition: all 0.5s ease;
  }

  span {
    color: ${colors.colorCoreGray};
    display: block;
    margin-top: ${dimensions.unitSpacing}px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 10px 20px ${rgba(colors.colorCoreDarkGray, 0.12)};

    img {
      transform: scale(1.1);
    }
  }

  @media (max-width: 780px) {
    width: 100%;
  }

  ${props => {
    if (props.selected) {
      return `
        box-shadow: 0 10px 20px ${rgba(colors.colorCoreDarkGray, 0.12)};
        img {
          transform: scale(1.1);
        }
      `;
    }
  }};
`;

const propTypes = {
  changeState: PropTypes.func,
  kind: PropTypes.string
};

class ChooseType extends Component {
  renderBox(name, image, desc, value) {
    return (
      <Box
        selected={this.props.kind === value}
        onClick={() => this.changeState(value)}
      >
        <img src={image} alt={name} />
        <span>{name}</span>
      </Box>
    );
  }

  changeState(value) {
    if (value === 'manual') {
      this.props.changeState('method', 'email');
    } else {
      this.props.changeState('method', 'messenger');
    }
    this.props.changeState('kind', value);
  }

  render() {
    return (
      <FlexItem>
        <BoxContainer v="center" h="center" overflow="auto">
          <div>
            {this.renderBox('ShoutBox', '/images/icons/erxes-07.svg', 'auto')}
            {this.renderBox('Popup', '/images/icons/erxes-08.svg', 'manual')}
            {this.renderBox(
              'Embedded',
              '/images/icons/erxes-08.svg',
              'visitorAuto'
            )}
          </div>
        </BoxContainer>
        <Divider />
        <Preview />
      </FlexItem>
    );
  }
}

ChooseType.propTypes = propTypes;

export default ChooseType;
