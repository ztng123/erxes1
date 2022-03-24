import dayjs from 'dayjs';

import { IActivityLogItemProps } from '../../../types';
import { ActivityDate, FlexBody, FlexCenterContent } from '../../../styles';
import Tip from '@erxes/ui/src/components/Tip';
import { renderUserFullName } from '@erxes/ui/src/utils';
import React from 'react';
import { Link } from 'react-router-dom';

class AssigneeLog extends React.Component<IActivityLogItemProps> {
  renderContent = () => {
    const { activity } = this.props;
    const { contentDetail, createdByDetail } = activity;

    let userName = 'Unknown';

    if (createdByDetail && createdByDetail.type === 'user') {
      const { content } = createdByDetail;

      if (content.details) {
        userName = renderUserFullName(createdByDetail.content);
      }
    }

    const { addedUsers = [], removedUsers = [] } = contentDetail;

    console.log(contentDetail);

    const addedUserNames = addedUsers.map(user => {
      return (
        <Link
          to={`/settings/team/details/${user._id}`}
          target="_blank"
          key={Math.random()}
        >
          &nbsp;{user.details.fullName || user.email}&nbsp;
        </Link>
      );
    });

    const removedUserNames = removedUsers.map(user => {
      return (
        <Link
          to={`/settings/team/details/${user._id}`}
          target="_blank"
          key={Math.random()}
        >
          &nbsp;{user.details.fullName || user.email}&nbsp;
        </Link>
      );
    });

    console.log(addedUserNames, removedUserNames);

    if (addedUserNames.length > 0 && removedUserNames.length === 0) {
      return (
        <span>
          {userName} assigned
          {addedUserNames}
        </span>
      );
    }

    if (removedUserNames && !addedUserNames) {
      return (
        <span>
          {userName} removed assignee of
          {removedUserNames}
        </span>
      );
    }

    return (
      <span>
        {userName} removed assignee of
        {removedUserNames}
      </span>
    );
  };

  render() {
    const { createdAt } = this.props.activity;

    return (
      <FlexCenterContent>
        <FlexBody>{this.renderContent()}</FlexBody>
        <Tip text={dayjs(createdAt).format('llll')}>
          <ActivityDate>
            {dayjs(createdAt).format('MMM D, h:mm A')}
          </ActivityDate>
        </Tip>
      </FlexCenterContent>
    );
  }
}

export default AssigneeLog;
