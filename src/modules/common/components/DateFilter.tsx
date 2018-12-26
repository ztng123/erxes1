import gql from 'graphql-tag';
import { Button, Icon } from 'modules/common/components';
import { __, router } from 'modules/common/utils';
import * as moment from 'moment';
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import styled from 'styled-components';
import { colors, dimensions, typography } from '../styles';

const PopoverButton = styled.div`
  display: inline-block;
  position: relative;

  > * {
    display: inline-block;
  }

  button {
    padding: 0;
  }

  i {
    margin-left: 5px;
    margin-right: 0;
    font-size: ${typography.fontSizeHeading6 / 2}px;
    transition: all ease 0.3s;
  }

  &[aria-describedby] {
    color: ${colors.colorSecondary};

    i {
      transform: rotate(180deg);
    }
  }

  &:hover {
    cursor: pointer;
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px ${dimensions.unitSpacing}px;

  .form-control {
    box-shadow: none;
    border-radius: 0;
    border: none;
    background: none;
    border-bottom: 1px solid ${colors.colorShadowGray};
    padding: 17px 14px;
    font-size: ${typography.fontSizeBody}px;

    &:focus {
      box-shadow: none;
      border-color: ${colors.colorSecondary};
    }
  }
`;

const FlexItem = styled.div`
  flex: 1;
  margin-left: 5px;
`;

const DateName = styled.div`
  text-transform: uppercase;
  margin: 5px 0 ${dimensions.unitSpacing}px 0;
  text-align: center;
`;

const DateFilters = styled.div`
  button {
    padding: 5px 15px;
    margin-bottom: 5px;
  }
`;

type Props = {
  queryParams?: any;
  history: any;
  countQuery?: string;
  countQueryParam?: string;
};

type ApolloClientProps = {
  client: any;
};

type State = {
  startDate: Date;
  endDate: Date;
  totalCount: number;
};

const format = 'YYYY-MM-DD HH:mm';

class DateFilter extends React.Component<Props & ApolloClientProps, State> {
  constructor(props) {
    super(props);

    const { startDate, endDate } = props.queryParams;

    const state: State = {
      startDate: new Date(),
      endDate: new Date(),
      totalCount: 0
    };

    if (startDate) {
      state.startDate = moment(startDate).toDate();
    }

    if (endDate) {
      state.endDate = moment(endDate).toDate();
    }

    this.state = state;
  }

  componentWillReceiveProps(nextProps) {
    const { queryParams } = nextProps;

    if (nextProps.countQuery) {
      if (queryParams.startDate && queryParams.endDate) {
        this.refetchCountQuery();
      }
    }
  }

  onDateChange = <T extends keyof State>(type: T, date: State[T]) => {
    if (typeof date !== 'string') {
      this.setState({ [type]: date } as Pick<State, keyof State>);
    }
  };

  refetchCountQuery = () => {
    const { client, queryParams, countQuery, countQueryParam } = this.props;

    if (!countQuery || !countQueryParam) {
      return;
    }

    client
      .query({
        query: gql(countQuery),
        variables: { ...queryParams }
      })

      .then(({ data }) => {
        this.setState({
          totalCount: data[countQueryParam]
        });
      });
  };

  filterByDate = () => {
    const { startDate, endDate } = this.state;

    const formattedStartDate = moment(startDate).format(format);
    const formattedEndDate = moment(endDate).format(format);

    router.setParams(this.props.history, {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });

    if (this.props.countQuery) {
      this.refetchCountQuery();
    }
  };

  renderCount = () => {
    const { totalCount } = this.state;

    if (this.props.countQuery) {
      return (
        <FlexItem>
          <span>
            {__('Total')}: {totalCount}
          </span>
        </FlexItem>
      );
    }

    return null;
  };

  renderPopover = () => {
    const props = {
      inputProps: { placeholder: __('Select a date') },
      timeFormat: 'HH:mm',
      dateFormat: 'YYYY/MM/DD',
      closeOnSelect: false
    };

    const onChangeStart = date => {
      if (typeof date !== 'string') {
        this.onDateChange('startDate', date.toDate());
      }
    };

    const onChangeEnd = date => {
      if (typeof date !== 'string') {
        this.onDateChange('endDate', date.toDate());
      }
    };

    return (
      <Popover id="filter-popover" title={__('Filter by date')}>
        <DateFilters>
          <FlexRow>
            <div>
              <DateName>Start Date</DateName>
              <Datetime
                {...props}
                input={false}
                value={this.state.startDate}
                onChange={onChangeStart}
              />
            </div>

            <div>
              <DateName>End Date</DateName>
              <Datetime
                {...props}
                input={false}
                value={this.state.endDate}
                onChange={onChangeEnd}
              />
            </div>
          </FlexRow>

          <FlexRow>
            {this.renderCount()}
            <Button
              btnStyle="warning"
              onClick={this.filterByDate}
              icon="filter"
            >
              Filter
            </Button>
          </FlexRow>
        </DateFilters>
      </Popover>
    );
  };

  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={this.renderPopover()}
        container={this}
        shouldUpdatePosition={true}
        rootClose={true}
      >
        <PopoverButton>
          {__('Date')} <Icon icon="downarrow" />
        </PopoverButton>
      </OverlayTrigger>
    );
  }
}

export default withApollo<Props>(DateFilter);
