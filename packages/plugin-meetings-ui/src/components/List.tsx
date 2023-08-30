import Button from '@erxes/ui/src/components/Button';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React, { useEffect, useState } from 'react';
import { MeetingForm } from '../components/myCalendar/meeting/Form';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IMeeting } from '../types';

import { menuMeeting } from '../contants';
import { MyCalendarList } from './myCalendar/MyCalendar';
import SideBar from '../containers/myCalendar/SideBar';
import SideBarContainer from '../containers/myMeetings/SideBar';
import { IUser } from '@erxes/ui/src/auth/types';
import { MyMeetingListContainer } from '../containers/myMeetings/List';

type Props = {
  meetings: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (meetings: IMeeting) => void;
  edit: (meetings: IMeeting) => void;
  loading: boolean;
  searchFilter: string;

  queryParams: any;
  route?: string;
  history: string;
  refetch: any;
  currentUser: IUser;
};

function List(props: Props) {
  const {
    meetings,
    renderButton,
    loading,
    searchFilter,
    queryParams,
    history,
    refetch,
    currentUser
  } = props;

  const [showSideBar, setShowSideBar] = useState<Boolean>(true);
  const [component, setComponent] = useState(<div />);
  const [sideBar, setSideBar] = useState(<div />);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);

  const { meetingId } = queryParams;
  const routePath = location.pathname.split('/').slice(-1)[0];

  useEffect(() => {
    switch (routePath) {
      case 'myMeetings':
        setComponent(<MyMeetingListContainer history={history} />);
        setSideBar(
          <SideBarContainer
            history={history}
            queryParams={queryParams}
            currentUser={currentUser}
          />
        );
        break;
      case 'agendaTemplate':
        setComponent(<div>1</div>);
        setSideBar(<div>sidebar 1</div>);
        break;
      default:
        setComponent(<MyCalendarList {...props} />);
        setSideBar(<SideBar history={history} queryParams={queryParams} />);
        break;
    }
  }, [queryParams, meetings]);

  const trigger = (
    <Button
      id={'AddMeetingsButton'}
      btnStyle="success"
      icon="plus-circle"
      onClick={() => setShowCreateMeeting(true)}
    >
      Create new meetings
    </Button>
  );

  const modalContent = props => (
    <MeetingForm
      {...props}
      types={[]}
      renderButton={renderButton}
      meetingDetail={meetings}
    />
  );

  const actionBarRight = (
    <ModalTrigger
      title={__('Create meetings')}
      trigger={trigger}
      content={modalContent}
      enforceFocus={false}
      size="xl"
    />
  );

  const title = !meetingId && (
    <Title capitalize={true}>{__('My Calendar')}</Title>
  );

  const actionBar = (
    <Wrapper.ActionBar left={title} right={actionBarRight} wideSpacing />
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Meetings')}
          submenu={menuMeeting(searchFilter)}
        />
      }
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={component}
          loading={loading}
          count={1}
          emptyText={__('Theres no meetings')}
          emptyImage="/images/actions/8.svg"
        />
      }
      leftSidebar={showSideBar && sideBar}
      transparent={true}
      hasBorder
    />
  );
}

export default List;
