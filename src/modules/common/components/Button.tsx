import { __ } from 'modules/common/utils';
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import styledTS from 'styled-components-ts';
import { colors } from '../styles';
import { darken, lighten } from '../styles/color';
import Icon from './Icon';

const types = {
  default: {
    background: colors.colorPrimary
  },
  primary: {
    background: colors.colorSecondary
  },
  success: {
    background: colors.colorCoreGreen
  },
  danger: {
    background: colors.colorCoreRed
  },
  warning: {
    background: colors.colorCoreYellow
  },
  simple: {
    background: colors.colorWhite,
    borderColor: colors.borderDarker,
    color: colors.colorCoreGray
  },
  link: {
    background: 'transparent',
    color: colors.colorCoreGray
  }
};

const sizes = {
  large: {
    padding: '10px 30px',
    fontSize: '13px'
  },
  medium: {
    padding: '7px 20px',
    fontSize: '12px'
  },
  small: {
    padding: '5px 15px',
    fontSize: '10px'
  }
};

const ButtonStyled = styledTS<{ size: string, btnStyle: string, block?: boolean }>(styled.button)`
  border-radius: 30px;
  position: relative;
  transition: all 0.3s ease;
  text-transform: uppercase;
  outline: 0;

  ${props => css`
    padding: ${sizes[props.size].padding};
    background: ${types[props.btnStyle].background};
    font-size: ${sizes[props.size].fontSize};
    color: ${types[props.btnStyle].color
      ? types[props.btnStyle].color
      : colors.colorWhite};
    border: ${props.btnStyle === 'simple'
      ? `1px solid ${colors.borderDarker}`
      : 'none'};
    display: ${props.block && 'block'};
    width: ${props.block && '100%'};
    box-shadow: 0 2px 16px 0 ${lighten(types[props.btnStyle].background, 45)};

    &:hover {
      cursor: pointer;
      text-decoration: none;
      color: ${types[props.btnStyle].color
        ? darken(colors.colorCoreGray, 24)
        : colors.colorWhite};
      box-shadow: ${props.btnStyle !== 'link' &&
        `0 2px 22px 0 ${lighten(types[props.btnStyle].background, 25)}`};
    }

    &:disabled {
      cursor: not-allowed !important;
      background: ${lighten(types[props.btnStyle].background, 30)};
      color: ${lighten(types[props.btnStyle].color, 20)};
    }
  `};

  a {
    color: ${colors.colorWhite};
  }

  & + button,
  + a,
  + span {
    margin-left: 10px;
  }

  > i + span,
  > span + i,
  > span i {
    margin-left: 5px;
  }
`;

const ButtonLink = styledTS<{ disabled?: boolean }>(ButtonStyled.withComponent('a').extend)`
  text-decoration: inherit;
  text-align: center;
  
  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
      background: lighten(types[props.btnStyle].background, 30);
    `};
`;

const ButtonGroup = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;

  button + a,
  a + button {
    margin-left: 10px;
  }
`;

type ButtonProps = {
  children?: React.ReactNode,
  className?: string,
  onClick?: (e: any) => void,
  href?: string,
  type?: string,
  btnStyle?: string,
  size?: string,
  disabled?: boolean,
  ignoreTrans?: boolean,
  block?: boolean,
  icon?: string
};

export default class Button extends Component<ButtonProps> {
  static Group = Group;

  static defaultProps = {
    btnStyle: 'default',
    size: 'medium',
    block: false,
    type: 'button'
  };

  render() {
    const { href, children, ignoreTrans, icon } = this.props;
    const Element = href ? ButtonLink : ButtonStyled;

    let content = children;

    if (!ignoreTrans && typeof content === 'string' && __) {
      content = __(content);
    }

    if (icon) {
      return (
        <Element {...this.props}>
          <Icon icon={icon} />
          {content && <span>{content}</span>}
        </Element>
      );
    }

    return <Element {...this.props}>{content}</Element>;
  }
}

function Group({ children }: { children: React.ReactNode }) {
  return <ButtonGroup>{children}</ButtonGroup>;
}