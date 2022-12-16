import _ from 'lodash';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import DetailLeftSidebar from './DetailLeftSidebar';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, FieldStyle, SidebarCounter, Table } from '@erxes/ui/src';
import { FinanceAmount, FlexRow } from '../../styles';
import { ICustomer } from '@erxes/ui-contacts/src/customers/types';
import { IOverallWorkDet, IPerform } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import { menuNavs } from '../../constants';
import { withRouter } from 'react-router-dom';
import DetailRightSidebar from './DetailRightSidebar';
import PerformRow from './PerformRow';
import { BarItems } from '@erxes/ui/src/layout/styles';
import Form from '../../perform/containers/PerformForm';

type Props = {
  history: any;
  queryParams: any;
  overallWork: IOverallWorkDet;
  errorMsg?: string;
  performs: IPerform[];
} & IRouterProps;

type State = {
  minPotentialCount: number;
  maxMadeCount: number;
};

class OverallWorkDetail extends React.Component<Props, State> {
  calcMinPotentialCount = () => {
    const { overallWork } = this.props;
    if (!overallWork) {
      return 0;
    }

    let count = overallWork.needProductsData[0].liveRem;

    for (const data of overallWork.needProductsData) {
      if (count > data.liveRem) {
        count = data.liveRem;
      }
    }

    return count;
  };

  calcMaxMadeCount = () => {
    const { overallWork } = this.props;
    if (!overallWork) {
      return 0;
    }

    let count = overallWork.resultProductsData[0].liveRem;

    for (const data of overallWork.resultProductsData) {
      const diff = data.quantity + data.reserveRem - data.liveRem;
      if (count < diff) {
        count = diff;
      }
    }

    return count;
  };

  constructor(props) {
    super(props);

    this.state = {
      minPotentialCount: this.calcMinPotentialCount(),
      maxMadeCount: this.calcMaxMadeCount()
    };
  }

  displayValue(overallWork, name) {
    const value = _.get(overallWork, name);
    return <FinanceAmount>{(value || 0).toLocaleString()}</FinanceAmount>;
  }

  renderRow(label, value) {
    return (
      <li>
        <FlexRow>
          <FieldStyle>{__(`${label}`)}:</FieldStyle>
          <SidebarCounter>{value || '-'}</SidebarCounter>
        </FlexRow>
      </li>
    );
  }

  renderEditRow(label, key) {
    const value = this.state[key];
    const onChangeValue = e => {
      this.setState({ [key]: Number(e.target.value) } as any);
    };
    return (
      <li>
        <FlexRow>
          <FieldStyle>{__(`${label}`)}:</FieldStyle>
          <FormControl type="number" onChange={onChangeValue} value={value} />
        </FlexRow>
      </li>
    );
  }

  generateLabel = customer => {
    const { firstName, primaryEmail, primaryPhone, lastName } =
      customer || ({} as ICustomer);

    let value = firstName ? firstName.toUpperCase() : '';

    if (lastName) {
      value = `${value} ${lastName}`;
    }
    if (primaryPhone) {
      value = `${value} (${primaryPhone})`;
    }
    if (primaryEmail) {
      value = `${value} /${primaryEmail}/`;
    }

    return value;
  };

  renderContent() {
    const {
      overallWork,
      queryParams,
      history,
      errorMsg,
      performs
    } = this.props;
    if (errorMsg) {
      return (
        <EmptyState
          text={errorMsg.replace('GraphQL error: ', '')}
          size="full"
          image={'/images/actions/11.svg'}
        />
      );
    }

    return (
      <Table whiteSpace="nowrap" bordered={true} hover={true}>
        <thead>
          <tr>
            <th>{__('Count')}</th>
            <th>{__('Status')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="overallWorks">
          {(performs || []).map(perform => (
            <PerformRow
              key={Math.random()}
              perform={perform}
              history={history}
              queryParams={queryParams}
            />
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    const { queryParams, history, overallWork } = this.props;

    const mainContent = this.renderContent();
    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Add performance')}
      </Button>
    );

    const modalContent = props => (
      <Form
        {...props}
        overallWorkDetail={overallWork}
        max={this.state.minPotentialCount}
      />
    );

    const actionBarRight = (
      <BarItems>
        <ModalTrigger
          title="Add Performance"
          size="xl"
          trigger={trigger}
          autoOpenKey="showProductModal"
          content={modalContent}
        />
      </BarItems>
    );

    const actionBarLeft = <Title>{'All jobs'}</Title>;

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__(`Overall works`)} submenu={menuNavs} />
        }
        actionBar={
          <Wrapper.ActionBar left={actionBarLeft} right={actionBarRight} />
        }
        leftSidebar={
          <DetailLeftSidebar queryParams={queryParams} history={history} />
        }
        rightSidebar={
          <DetailRightSidebar
            queryParams={queryParams}
            overallWork={overallWork}
            counts={this.state}
          />
        }
        content={mainContent}
      />
    );
  }
}

export default withRouter<IRouterProps>(OverallWorkDetail);
