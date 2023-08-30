import { Table } from '@erxes/ui/src/components';
import React from 'react';
import { IMeeting } from '../../types';
import { Row } from './Row';

type Props = {
  meetings: IMeeting[];
};

export const ListComponent = (props: Props) => {
  const { meetings } = props;
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>{'Meeting name'}</th>
            <th>{'Saved By'}</th>
            <th>{'Saved At'}</th>
            <th>{'Members'}</th>
            <th>
              <>{'Action'}</>
            </th>
          </tr>
        </thead>
        <tbody>
          {meetings?.map((meeting: IMeeting) => {
            return <Row meeting={meeting} />;
          })}
        </tbody>
      </Table>
    </>
  );
};
