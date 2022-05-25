import {
  __,
  ActivityInputs,
  ActivityLogsContainer as ActivityLogs,
  Wrapper
} from '@erxes/ui/src';
import { IUser } from '@erxes/ui/src/auth/types';
import { IProduct } from '@erxes/ui-products/src/types';
import React from 'react';

import { IContractDoc } from '../../types';
import ScheduleSection from '../schedules/ScheduleSection';
import ActivityItem from './ActivityItem';
import CollateralsSection from './CollateralsSection';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

type Props = {
  contract: IContractDoc;
  currentUser: IUser;
  saveItem: (doc: IContractDoc, callback?: (item) => void) => void;
  regenSchedules: (contractId: string) => void;
};

type State = {
  amount: any;
  collaterals: IProduct[];
  collateralsData: any;
};

class ContractDetails extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const contract = props.contract;

    this.state = {
      amount: contract.amount || {},
      collateralsData: contract.collaterals
        ? contract.collaterals.map(p => ({ ...p }))
        : [],
      // collecting data for ItemCounter component
      collaterals: contract.collaterals
        ? contract.collaterals.map(p => p.collateral)
        : []
    };
  }

  saveCollateralsData = () => {
    const { collateralsData } = this.state;
    const { saveItem, contract } = this.props;
    const collaterals: IProduct[] = [];
    const amount: any = {};
    const filteredCollateralsData: any = [];

    collateralsData.forEach(data => {
      // collaterals
      if (data.collateral) {
        if (data.currency) {
          // calculating item amount
          if (!amount[data.currency]) {
            amount[data.currency] = data.amount || 0;
          } else {
            amount[data.currency] += data.amount || 0;
          }
        }
        // collecting data for ItemCounter component
        collaterals.push(data.collateral);
        data.collateralId = data.collateral._id;
        filteredCollateralsData.push(data);
      }
    });

    this.setState(
      { collateralsData: filteredCollateralsData, collaterals, amount },
      () => {
        saveItem({ ...contract, collateralsData });
      }
    );
  };

  onChangeField = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  render() {
    const { contract, regenSchedules } = this.props;

    const title = contract.number || 'Unknown';

    const breadcrumb = [
      { title: __('Contracts'), link: '/erxes-plugin-loan/contract-list' },
      { title }
    ];

    const pDataChange = pData => this.onChangeField('collateralsData', pData);
    const prsChange = prs => this.onChangeField('collaterals', prs);

    const content = (
      <>
        <CollateralsSection
          {...this.props}
          onChangeCollateralsData={pDataChange}
          onChangeCollaterals={prsChange}
          saveCollateralsData={this.saveCollateralsData}
          collateralsData={this.state.collateralsData}
          collaterals={this.state.collaterals}
          contractId={contract._id}
        ></CollateralsSection>

        <ScheduleSection
          contractId={contract._id}
          isFirst={false}
          regenSchedules={regenSchedules}
        ></ScheduleSection>
        <ScheduleSection
          contractId={contract._id}
          isFirst={true}
          regenSchedules={regenSchedules}
        ></ScheduleSection>

        <ActivityInputs
          contentTypeId={contract._id}
          contentType="contract"
          showEmail={false}
        />
        <ActivityLogs
          target={contract.number || ''}
          contentId={contract._id}
          contentType="contract"
          extraTabs={[
            { name: 'plugin_invoices', label: 'Invoices / Transaction' }
          ]}
          activityRenderItem={ActivityItem}
        />
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
        leftSidebar={<LeftSidebar {...this.props} />}
        rightSidebar={<RightSidebar contract={contract} />}
        content={content}
        transparent={true}
      />
    );
  }
}

export default ContractDetails;
