import Box from '@erxes/ui/src/components/Box';
import Icon from '@erxes/ui/src/components/Icon';
import Alert from '@erxes/ui/src/utils/Alert';
import confirm from '@erxes/ui/src/utils/confirmation/confirm';

import { __ } from 'coreui/utils';
import React from 'react';

import SchedulesList from '../../containers/Schedules';
import { ScrollTableColls } from '../../styles';
import withConsumer from '../../../withConsumer';
import { can } from '@erxes/ui/src/utils/core';
import { IUser } from '@erxes/ui/src/auth/types';

type Props = {
  contractId: string;
  isFirst: boolean;
  regenSchedules: (contractId: string) => void;
  fixSchedules?: (contractId: string) => void;
  hasTransaction?: boolean;
  currentUser: IUser;
  leaseType?: string;
};

function ScheduleSection({
  contractId,
  isFirst,
  leaseType,
  regenSchedules,
  fixSchedules,
  hasTransaction,
  currentUser
}: Props) {
  const onRegenSchedules = () =>
    confirm(__('Are you sure Regenerate Schedule?'))
      .then(() => regenSchedules(contractId))
      .catch(error => {
        Alert.error(error.message);
      });

  const onFixSchedules = () =>
    confirm(__('Are you sure Fix Schedule?'))
      .then(() => fixSchedules && fixSchedules(contractId))
      .catch(error => {
        Alert.error(error.message);
      });

  const renderExtraButton = () => {
    if (isFirst || leaseType !== 'finance') {
      return <></>;
    }

    if (hasTransaction)
      return (
        <button onClick={onFixSchedules} title={'fix schedule'}>
          <Icon icon="refresh-1" />
        </button>
      );

    return (
      <button onClick={onRegenSchedules} title="create schedule">
        <Icon icon="refresh-1" />
      </button>
    );
  };

  return (
    <Box
      title={__(`${(isFirst && 'First ') || ''}Schedules`)}
      name="showSchedules"
      isOpen={!isFirst}
      extraButtons={can('manageSchedule', currentUser) && renderExtraButton()}
    >
      <ScrollTableColls>
        <SchedulesList
          contractId={contractId}
          isFirst={isFirst}
          leaseType={leaseType}
        ></SchedulesList>
      </ScrollTableColls>
    </Box>
  );
}

export default withConsumer(ScheduleSection);
