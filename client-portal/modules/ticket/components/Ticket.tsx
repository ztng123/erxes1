import { Config, IUser } from '../../types';
import { Label, ListBody, ListHead, ListRow } from '../../styles/tickets';

import Detail from '../containers/Detail';
import EmptyContent from '../../common/EmptyContent';
import React from 'react';
import TicketHeader from './TicketHeader';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Card } from 'react-bootstrap';
import Group from '../containers/Group';
type Props = {
  loading: boolean;
  tickets: any;
  currentUser: IUser;
  config: Config;
  mode: any;
  setMode: any;
  stages: any;
  pipeLinelabels: any;
  pipelineAssignedUsers: any;
};

const duedateFilter = [
  'noCloseDate',
  'nextMonth',
  'nextWeek',
  'overdue',
  'nextDay'
];
const priorityFilter = ['Critical', 'High', 'Normal', 'Low'];
export default function Ticket({
  tickets,
  currentUser,
  config,
  mode,
  setMode,
  stages,
  pipeLinelabels,
  pipelineAssignedUsers
}: Props) {
  const router = useRouter();
  const { itemId } = router.query as { itemId: string };

  if (itemId) {
    return (
      <Detail
        _id={itemId}
        onClose={() => router.push('/tickets')}
        currentUser={currentUser}
        config={config}
      />
    );
  }

  // return (
  //   <>
  //     <TicketHeader ticketLabel={config.ticketLabel || 'Tickets'} />
  //     {mode === 'label'}
  //     {renderContent()}
  //   </>
  // );

  if (mode === 'stage') {
    return (
      <>
        <TicketHeader
          ticketLabel={config.ticketLabel || 'Tickets'}
          mode={mode}
          setMode={setMode}
        />

        {stages?.stages?.map(d => {
          return (
            <Card>
              <Card.Header>
                <a>{d?.name}</a>
              </Card.Header>
              <Card.Body>
                <Group type={'stage'} id={d._id} />
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }

  if (mode === 'label') {
    console.log(pipeLinelabels);
    return (
      <>
        <TicketHeader
          ticketLabel={config.ticketLabel || 'Tickets'}
          mode={mode}
          setMode={setMode}
        />

        {pipeLinelabels?.pipelineLabels?.map(d => {
          return (
            <Card>
              <Card.Header>
                <a>{d?.name}</a>
              </Card.Header>
              <Card.Body>
                <Group type={'label'} id={d._id} />
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }
  if (mode === 'duedate') {
    return (
      <>
        <TicketHeader
          ticketLabel={config.ticketLabel || 'Tickets'}
          mode={mode}
          setMode={setMode}
        />

        {duedateFilter?.map(d => {
          return (
            <Card>
              <Card.Header>
                <a>{d}</a>
              </Card.Header>
              <Card.Body>
                <Group type={'duedate'} id={d} />
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }
  if (mode === 'priority') {
    return (
      <>
        <TicketHeader
          ticketLabel={config.ticketLabel || 'Tickets'}
          mode={mode}
          setMode={setMode}
        />

        {priorityFilter?.map(d => {
          return (
            <Card>
              <Card.Header>
                <a>{d}</a>
              </Card.Header>
              <Card.Body>
                <Group type={'priority'} id={d} />
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }
  if (mode === 'user') {
    console.log(pipelineAssignedUsers);
    return (
      <>
        <TicketHeader
          ticketLabel={config.ticketLabel || 'Tickets'}
          mode={mode}
          setMode={setMode}
        />

        {pipelineAssignedUsers.pipelineAssignedUsers?.map(d => {
          return (
            <Card>
              <Card.Header>
                <a>{d?.details?.fullName}</a>
              </Card.Header>
              <Card.Body>
                <Group type={'user'} id={d._id} />
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }
  return (
    <>
      <TicketHeader
        ticketLabel={config.ticketLabel || 'Tickets'}
        mode={mode}
        setMode={setMode}
      />
      {/* {renderContent()} */}
      <Card>
        <Card.Body>
          <Group type={'all'} id={''} />
        </Card.Body>
      </Card>
    </>
  );
}
