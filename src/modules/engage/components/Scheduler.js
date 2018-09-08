import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  Icon
} from 'modules/common/components';
import Datetime from 'react-datetime';
import { SCHEDULE_TYPES } from 'modules/engage/constants';
import { DateTimePicker, SelectMonth } from '../styles';

const contextTypes = {
  __: PropTypes.func
};

const propTypes = {
  scheduleDate: PropTypes.object,
  onChange: PropTypes.func
};

class Scheduler extends Component {
  constructor(props) {
    super(props);

    this.state = { scheduleDate: props.scheduleDate };
  }

  changeSchedule(key, value) {
    let scheduleDate = {
      ...this.state.scheduleDate
    };

    scheduleDate[key] = value;

    this.setState({ scheduleDate });
    this.props.onChange('scheduleDate', scheduleDate);
  }

  generateOptions(number) {
    let options = [];

    for (let i = 1; i <= number; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  }

  renderMonthSelector() {
    const { type, month } = this.state.scheduleDate;

    if (type !== 'year') {
      return null;
    }

    return (
      <Fragment>
        <ControlLabel>Choose month:</ControlLabel>
        <FormControl
          componentClass="select"
          value={month}
          onChange={e => this.changeSchedule('month', e.target.value)}
        >
          <option /> {this.generateOptions(12)}
        </FormControl>
      </Fragment>
    );
  }

  renderDaySelector() {
    const { type, day } = this.state.scheduleDate;

    if (type !== 'year' && type !== 'month') {
      return null;
    }

    return (
      <Fragment>
        <ControlLabel>Choose day:</ControlLabel>
        <FormControl
          componentClass="select"
          value={day}
          onChange={e => this.changeSchedule('day', e.target.value)}
        >
          <option /> {this.generateOptions(31)}
        </FormControl>
      </Fragment>
    );
  }

  render() {
    const { __ } = this.context;
    const { type, time } = this.state.scheduleDate;

    const props = {
      inputProps: { placeholder: __('Click to select a date') },
      timeFormat: 'HH:mm'
    };

    return (
      <FormGroup>
        <ControlLabel>Schedule:</ControlLabel>
        <FormControl
          componentClass="select"
          value={type}
          onChange={e => this.changeSchedule('type', e.target.value)}
        >
          <option />{' '}
          {SCHEDULE_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {__(type.label)}
            </option>
          ))}
        </FormControl>

        <SelectMonth>
          {this.renderMonthSelector()}
          {this.renderDaySelector()}
        </SelectMonth>

        <DateTimePicker>
          <Datetime
            {...props}
            value={time}
            onChange={e => this.changeSchedule('time', e)}
            dateFormat={false}
            inputProps={{ placeholder: 'Click to choose time' }}
          />
          <Icon icon="calendar" />
        </DateTimePicker>
      </FormGroup>
    );
  }
}

Scheduler.contextTypes = contextTypes;
Scheduler.propTypes = propTypes;

export default Scheduler;
