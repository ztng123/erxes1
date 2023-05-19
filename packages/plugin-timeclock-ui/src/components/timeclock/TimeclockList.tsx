import Button from '@erxes/ui/src/components/Button';
import { ITimeclock } from '../../types';
import Row from './TimeclockRow';
import { __ } from '@erxes/ui/src/utils';
import React, { useState } from 'react';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Table from '@erxes/ui/src/components/table';
import TimeForm from '../../containers/timeclock/TimeFormList';
import {
  CustomRangeContainer,
  FlexCenter,
  FlexColumn,
  FlexRowLeft,
  TextAlignCenter,
  ToggleButton
} from '../../styles';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { ControlLabel } from '@erxes/ui/src/components/form';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { isEnabled } from '@erxes/ui/src/utils/core';
import { IUser } from '@erxes/ui/src/auth/types';
import { IBranch, IDepartment } from '@erxes/ui/src/team/types';
import Icon from '@erxes/ui/src/components/Icon';

type Props = {
  currentUser: IUser;
  departments: IDepartment[];
  branches: IBranch[];

  queryParams: any;
  history: any;
  startTime?: Date;
  timeclocks: ITimeclock[];
  loading: boolean;
  totalCount: number;

  isCurrentUserAdmin: boolean;

  startClockTime?: (userId: string) => void;
  extractAllMsSqlData: (startDate: Date, endDate: Date) => void;
  removeTimeclock: (_id: string) => void;

  getActionBar: (actionBar: any) => void;
  showSideBar: (sideBar: boolean) => void;
  getPagination: (pagination: any) => void;
};

function List(props: Props) {
  const {
    isCurrentUserAdmin,

    timeclocks,
    totalCount,
    startClockTime,
    extractAllMsSqlData,
    removeTimeclock,
    getActionBar,
    showSideBar,
    getPagination
  } = props;

  const trigger = (
    <Button btnStyle={'success'} icon="plus-circle">
      Start Shift
    </Button>
  );

  const [startDate, setStartDate] = useState(
    new Date(localStorage.getItem('startDate') || Date.now())
  );
  const [endDate, setEndDate] = useState(
    new Date(localStorage.getItem('endDate') || Date.now())
  );

  const extractTrigger = isCurrentUserAdmin ? (
    <Button icon="plus-circle">Extract all data</Button>
  ) : (
    <></>
  );

  const [isSideBarOpen, setIsOpen] = useState(
    localStorage.getItem('isSideBarOpen') === 'true' ? true : false
  );

  const onToggleSidebar = () => {
    const toggleIsOpen = !isSideBarOpen;
    setIsOpen(toggleIsOpen);
    localStorage.setItem('isSideBarOpen', toggleIsOpen.toString());
  };

  const modalContent = contenProps => (
    <TimeForm
      {...contenProps}
      {...props}
      startClockTime={startClockTime}
      timeclocks={timeclocks}
    />
  );

  const onStartDateChange = dateVal => {
    setStartDate(dateVal);
    localStorage.setItem('startDate', startDate.toISOString());
  };

  const onEndDateChange = dateVal => {
    setEndDate(dateVal);
    localStorage.setItem('endDate', endDate.toISOString());
  };
  const extractContent = contentProps => (
    <FlexColumn marginNum={10}>
      <ControlLabel>Select Date Range</ControlLabel>
      <CustomRangeContainer>
        <DateControl
          required={false}
          value={startDate}
          name="startDate"
          placeholder={'Starting date'}
          dateFormat={'YYYY-MM-DD'}
          onChange={onStartDateChange}
        />
        <DateControl
          required={false}
          value={endDate}
          name="endDate"
          placeholder={'Ending date'}
          dateFormat={'YYYY-MM-DD'}
          onChange={onEndDateChange}
        />
      </CustomRangeContainer>
      <FlexCenter>
        <Button onClick={() => extractAllMsSqlData(startDate, endDate)}>
          Extract all data
        </Button>
      </FlexCenter>
    </FlexColumn>
  );

  const actionBarLeft = (
    <FlexRowLeft>
      <ToggleButton
        id="btn-inbox-channel-visible"
        isActive={isSideBarOpen}
        onClick={onToggleSidebar}
      >
        <Icon icon="subject" />
      </ToggleButton>

      <Title capitalize={true}>
        {__(new Date().toDateString().slice(0, -4))}
      </Title>
    </FlexRowLeft>
  );

  const actionBarRight = (
    <>
      {!isEnabled('bichil') && (
        <ModalTrigger
          title={__('Extract all data')}
          trigger={extractTrigger}
          content={extractContent}
        />
      )}
      <ModalTrigger
        title={__('Start shift')}
        trigger={trigger}
        content={modalContent}
      />
    </>
  );

  const actionBar = (
    <Wrapper.ActionBar
      left={actionBarLeft}
      right={actionBarRight}
      hasFlex={true}
      wideSpacing={true}
    />
  );

  const compareUserName = (a, b) => {
    if (a.employeeUserName < b.employeeUserName) {
      return -1;
    }
    if (a.employeeUserName > b.employeeUserName) {
      return 1;
    }
    return 0;
  };

  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Team member')}</th>
          <th>{__('Shift date')}</th>
          <th>{__('Check In')}</th>
          <th>{__('In Device')}</th>
          <th>{__('Check Out')}</th>
          <th>{__('Out Device')}</th>
          <th>{__('Overnight')}</th>
          <th>{__('Location')}</th>
          <th>
            <TextAlignCenter>{__('Action')}</TextAlignCenter>
          </th>
        </tr>
      </thead>
      <tbody>
        {timeclocks.sort(compareUserName).map(timeclock => {
          return (
            <Row
              key={timeclock._id}
              timeclock={timeclock}
              removeTimeclock={removeTimeclock}
            />
          );
        })}
      </tbody>
    </Table>
  );

  getActionBar(actionBar);
  showSideBar(isSideBarOpen);
  getPagination(<Pagination count={totalCount} />);

  return content;
}

export default List;
