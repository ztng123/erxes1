import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './Form';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IMenu, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { FormControl } from '@erxes/ui/src/components/form';
import { colors, dimensions } from '@erxes/ui/src/styles';
import xss from 'xss';

const MenuNameStyled = styledTS<{ checked: boolean }>(styled.div).attrs({})`
    color: ${colors.colorCoreBlack};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')}
    `;

export const MenuWrapper = styledTS<{ space: number }>(
  styled.div
)`padding-left: ${props => props.space * 20}px;
  display:inline-flex;
  justify-content:flex-start;
  align-items: center;
`;

const Margin = styledTS(styled.div)`
 margin: ${dimensions.unitSpacing}px;
`;

type Props = {
  menu: IMenu;
  space: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  menus: IMenu[];
  remove: (menu: IMenu) => void;
  edit: (menu: IMenu) => void;
  types?: IType[];
};

type State = {
  checked: boolean;
};

class Row extends React.Component<Props, State> {
  Menus({ menu, checked }) {
    return <MenuNameStyled checked={checked}>{menu.name}</MenuNameStyled>;
  }

  removeMenu = () => {
    const { remove, menu } = this.props;

    remove(menu);
  };

  toggleCheck = () => {
    const { edit, menu } = this.props;

    edit({ _id: menu._id, checked: !menu.checked });
  };

  render() {
    const { menu, renderButton, space, menus, types } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="top">
          <Icon icon="edit-3"></Icon>
        </Tip>
      </Button>
    );

    const content = props => (
      <Form
        {...props}
        types={types}
        menu={menu}
        renderButton={renderButton}
        menus={menus}
      />
    );

    const extractDate = menu.expiryDate
      ? menu.expiryDate?.toString().split('T')[0]
      : '-';

    return (
      <tr>
        <td>
          <MenuWrapper space={space}>
            <FormControl
              componentClass="checkbox"
              onChange={this.toggleCheck}
              color={colors.colorPrimary}
              defaultChecked={menu.checked || false}
            ></FormControl>
            <Margin>
              <this.Menus menu={menu} checked={menu.checked || false} />
            </Margin>
          </MenuWrapper>
        </td>
        <td>{extractDate}</td>
        <td>{menu.title}</td>
        <td
          dangerouslySetInnerHTML={{
            __html: xss(menu.content ? menu.content.toString() : '')
          }}
        />
        <td>{menu.showTitle ? 'Yes' : 'No'}</td>{' '}
        {/* 타이틀 표시 여부 열 추가 */}
        <td>
          <ActionButtons>
            <ModalTrigger
              title="Edit menu"
              trigger={editTrigger}
              content={content}
            />

            <Tip text={__('Delete')} placement="top">
              <Button
                btnStyle="link"
                onClick={this.removeMenu}
                icon="times-circle"
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
