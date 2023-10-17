import dayjs from 'dayjs';
import { FieldStyle, SidebarCounter, SidebarList } from '@erxes/ui/src';
import { __ } from 'coreui/utils';
import React from 'react';
import { Description } from '../../styles';
import { IContract } from '../../types';

type Props = {
  contract: IContract;
};

class DetailInfo extends React.Component<Props> {
  renderRow = (label, value) => {
    return (
      <li>
        <FieldStyle>{__(`${label}`)}</FieldStyle>
        <SidebarCounter>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  renderTeamMember = (label, field) => {
    const { contract } = this.props;

    return this.renderRow(
      label,
      contract[field]
        ? (contract[field].details && contract[field].details.fullName) ||
            contract[field].email
        : '-'
    );
  };

  render() {
    const { contract } = this.props;

    return (
      <SidebarList className="no-link">
        {this.renderRow(
          'Contract Type',
          contract.contractType ? contract.contractType.name : ''
        )}
        {this.renderRow('Contract Number', contract.number)}
        {this.renderRow('Status', contract.status)}
        {this.renderRow('Start Date', dayjs(contract.startDate).format('ll'))}
        {this.renderRow(
          'Tenor (in months)',
          (contract.duration || 0).toLocaleString()
        )}
        {this.renderRow('End Date', dayjs(contract.endDate).format('ll'))}

        {this.renderRow(
          'Interest Rate',
          (contract.interestRate || 0).toLocaleString()
        )}
        {this.renderRow('Currency', contract.currency)}
        {this.renderRow(
          'Saving Amount',
          (contract.savingAmount || 0).toLocaleString()
        )}
        {this.renderRow(
          'Stored interest',
          (contract.storedInterest || 0).toLocaleString()
        )}

        {this.renderTeamMember('Saving officer', 'createdBy')}
        <li>
          <FieldStyle>{__(`Description`)}</FieldStyle>
        </li>
        <Description
          dangerouslySetInnerHTML={{
            __html: contract.description
          }}
        />
      </SidebarList>
    );
  }
}

export default DetailInfo;
