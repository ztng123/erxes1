import dayjs from 'dayjs';
import { __ } from '@erxes/ui/src/utils';
import { GENDER_TYPES } from '@erxes/ui/src/customers/constants';
import { ICustomer } from '@erxes/ui/src/customers/types';
import {
  FieldStyle,
  SidebarCounter,
  SidebarFlexRow,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import React from 'react';
import PrimaryEmail from './PrimaryEmail';
import PrimaryPhone from './PrimaryPhone';
import { IFieldsVisibility } from '../../types';

type Props = {
  customer: ICustomer;
  hasPosition?: boolean;
  fieldsVisibility: IFieldsVisibility;
};

class DetailInfo extends React.PureComponent<Props> {
  renderRow(field, value) {
    const { fieldsVisibility } = this.props;

    if (!fieldsVisibility[field]) {
      return null;
    }

    const label = fieldsVisibility[field];

    return (
      <li>
        <FieldStyle>{__(`${label}`)}:</FieldStyle>
        <SidebarCounter fullLength={label === 'Description'}>
          {value || '-'}
        </SidebarCounter>
      </li>
    );
  }

  renderEmail(status?: string, email?: string) {
    return (
      <li>
        <FieldStyle>{__('Primary Email')}:</FieldStyle>
        <SidebarCounter>
          <PrimaryEmail email={email} status={status} />
        </SidebarCounter>
      </li>
    );
  }

  renderPhone(status?: string, phone?: string) {
    return (
      <li>
        <FieldStyle>{__('Primary phone')}:</FieldStyle>
        <SidebarCounter>
          <PrimaryPhone phone={phone} status={status} />
        </SidebarCounter>
      </li>
    );
  }

  renderDescription(field: string, description?: string) {
    const { fieldsVisibility } = this.props;

    if (!fieldsVisibility[field]) {
      return null;
    }

    return (
      <SidebarFlexRow>
        {__(`Description`)}:<span>{description || '-'}</span>
      </SidebarFlexRow>
    );
  }

  renderPosition(customer) {
    if (!this.props.hasPosition) {
      return null;
    }

    return this.renderRow('position', customer.position);
  }

  render() {
    const { customer, fieldsVisibility = [] } = this.props;

    if (!Object.keys(fieldsVisibility).length) {
      return null;
    }

    return (
      <SidebarList className="no-link">
        {this.renderRow('code', customer.code)}
        {this.renderEmail(
          customer.emailValidationStatus,
          customer.primaryEmail
        )}
        {this.renderPhone(
          customer.phoneValidationStatus,
          customer.primaryPhone
        )}
        {this.renderPosition(customer)}
        {this.renderRow(
          'owner',
          customer.owner && customer.owner.details
            ? customer.owner.details.fullName
            : ''
        )}
        {this.renderRow('department', customer.department)}
        {this.renderRow('pronoun', GENDER_TYPES()[customer.sex || 0])}
        {this.renderRow(
          'birthDate',
          customer.birthDate && dayjs(customer.birthDate).format('MMM,DD YYYY')
        )}
        {this.renderRow('isSubscribed', customer.isSubscribed)}
        {this.renderRow('score', customer.score)}
        {this.renderDescription('description', customer.description)}
      </SidebarList>
    );
  }
}

export default DetailInfo;
