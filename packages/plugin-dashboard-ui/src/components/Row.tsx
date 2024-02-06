import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './Form';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IDashboard, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { FormControl } from '@erxes/ui/src/components/form';
import { colors, dimensions } from '@erxes/ui/src/styles';

const DashboardNameStyled = styledTS<{ checked: boolean }>(styled.div).attrs(
  {}
)`
    color: ${colors.colorCoreBlack};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')}
    `;

export const DashboardWrapper = styledTS<{ space: number }>(
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
  dashboard: IDashboard;
  space: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  dashboards: IDashboard[];
  remove: (dashboard: IDashboard) => void;
  edit: (dashboard: IDashboard) => void;
  types?: IType[];
};

type State = {
  checked: boolean;
};

class Row extends React.Component<Props, State> {
  Dashboards({ dashboard, checked }) {
    return (
      <DashboardNameStyled checked={checked}>
        {dashboard.name}
      </DashboardNameStyled>
    );
  }

  removeDashboard = () => {
    const { remove, dashboard } = this.props;

    remove(dashboard);
  };

  toggleCheck = () => {
    const { edit, dashboard } = this.props;

    edit({ _id: dashboard._id, checked: !dashboard.checked });
  };

  render() {
    const { dashboard, renderButton, space, dashboards, types } = this.props;

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
        dashboard={dashboard}
        renderButton={renderButton}
        dashboards={dashboards}
      />
    );

    const extractDate = dashboard.expiryDate
      ? dashboard.expiryDate?.toString().split('T')[0]
      : '-';

    return (
      <tr>
        <td>
          <DashboardWrapper space={space}>
            <FormControl
              componentClass="checkbox"
              onChange={this.toggleCheck}
              color={colors.colorPrimary}
              defaultChecked={dashboard.checked || false}
            ></FormControl>
            <Margin>
              <this.Dashboards
                dashboard={dashboard}
                checked={dashboard.checked || false}
              />
            </Margin>
          </DashboardWrapper>
        </td>
        <td>{extractDate}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              title="Edit dashboard"
              trigger={editTrigger}
              content={content}
            />

            <Tip text={__('Delete')} placement="top">
              <Button
                btnStyle="link"
                onClick={this.removeDashboard}
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
