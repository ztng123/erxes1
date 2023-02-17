import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import { ITimeclock, ITimelog } from '../../types';
import { __ } from '@erxes/ui/src/utils';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import TimeForm from '../../containers/timeclock/TimeFormList';
import dayjs from 'dayjs';
import { dateFormat, timeFormat } from '../../constants';
import Tip from '@erxes/ui/src/components/Tip';
import { returnDeviceTypes } from '../../utils';
import Icon from '@erxes/ui/src/components/Icon';
import TimelogForm from '../../containers/timeclock/TimelogForm';

type Props = {
  history: any;
  timelogsPerUser: ITimelog[];
  timeclock: ITimeclock;
  removeTimeclock: (_id: string) => void;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  shiftTrigger = shiftStarted =>
    shiftStarted ? (
      <Button id="timeClockButton1" btnStyle={'danger'} icon="plus-circle">
        End shift
      </Button>
    ) : (
      <>Ended</>
    );

  shiftBtnTrigger = shiftStarted => (
    <ModalTrigger
      title={__('Start shift')}
      trigger={this.shiftTrigger(shiftStarted)}
      content={this.modalContent}
    />
  );

  modalContent = props => (
    <TimeForm
      {...props}
      selectedUserId={
        this.props.timeclock.user ? this.props.timeclock.user._id : null
      }
      shiftId={this.props.timeclock._id}
      shiftStarted={this.props.timeclock.shiftActive}
    />
  );

  renderTimeLogs = () => {
    const { timelogsPerUser } = this.props;
  };

  editShiftTimeContent = (contentProps: any, timeclock: ITimeclock) => {
    const getStartDate = dayjs(timeclock.shiftStart)
      .add(-1, 'day')
      .format(dateFormat);
    const getEndDate = dayjs(timeclock.shiftStart)
      .add(1, 'day')
      .format(dateFormat);

    return (
      <TimelogForm
        contentProps={contentProps}
        startDate={getStartDate}
        endDate={getEndDate}
        userId={timeclock.user._id}
        timeclock={timeclock}
      />
    );
  };

  editShiftTimeTrigger = () => (
    <Button btnStyle="link">
      <Icon icon="edit-3" />
    </Button>
  );

  render() {
    const { timeclock, removeTimeclock } = this.props;
    const shiftStartTime = dayjs(timeclock.shiftStart).format(timeFormat);
    const shiftDate =
      new Date(timeclock.shiftStart).toDateString().split(' ')[0] +
      '\t' +
      dayjs(timeclock.shiftStart).format(dateFormat);

    const shiftEndTime = timeclock.shiftEnd
      ? dayjs(timeclock.shiftEnd).format(timeFormat)
      : '-';

    const overNightShift =
      timeclock.shiftEnd &&
      new Date(timeclock.shiftEnd).toLocaleDateString() !==
        new Date(timeclock.shiftStart).toLocaleDateString();

    return (
      <tr>
        <td>
          {timeclock.user && timeclock.user.details
            ? timeclock.user.details.fullName ||
              `${timeclock.user.details.firstName} ${timeclock.user.details.lastName}`
            : timeclock.employeeUserName || timeclock.employeeId}
        </td>
        <td>{shiftDate}</td>
        <td>{shiftStartTime}</td>
        <td>{returnDeviceTypes(timeclock.deviceType)[0]}</td>
        <td>{shiftEndTime}</td>
        <td>{returnDeviceTypes(timeclock.deviceType)[1]}</td>
        <td>{overNightShift ? 'O' : ''}</td>
        <td>
          {timeclock.branchName ? timeclock.branchName : timeclock.deviceName}
        </td>
        <td>{this.shiftBtnTrigger(timeclock.shiftActive)}</td>
        <td>
          <ModalTrigger
            size="lg"
            title="Edit Shift"
            trigger={this.editShiftTimeTrigger()}
            content={contentProps =>
              this.editShiftTimeContent(contentProps, timeclock)
            }
          />
          <Tip text={__('Delete')} placement="top">
            <Button
              btnStyle="link"
              onClick={() => removeTimeclock(timeclock._id)}
              icon="times-circle"
            />
          </Tip>
        </td>
      </tr>
    );
  }
}

export default Row;
