import Icon from 'erxes-ui/lib/components/Icon';
import React from 'react';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import s from 'underscore.string';

const Item = styledTS<{ color: string }>(styled.div)`
  margin: 10px 10px 0 0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 6px 10px 1px rgba(136,136,136,0.08);
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 500;
  font-size: 12px;

  > i {
    color: ${props => props.color};
    padding: 10px;
    border-radius: 6px;
    line-height: 12px;
    margin-right: 10px;
    font-size: 18px;
  }
`;

const Number = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;

  span {
    font-size: 60%;
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -10px -10px 0 0;
`;

type Props = {
  name: string;
  percent: number;
  color: string;
  icon: string;
};

export default function PercentItem({ name, percent, icon, color }: Props) {
  if (typeof percent !== 'number') {
    return null;
  }

  return (
    <Item color={color}>
      <Icon icon={icon} />
      <div>
        <span>{name}</span>
        <Number>
          {percent > 100 ? 100 : s.numberFormat(percent, 2)}
          <span>%</span>
        </Number>
      </div>
    </Item>
  );
}
