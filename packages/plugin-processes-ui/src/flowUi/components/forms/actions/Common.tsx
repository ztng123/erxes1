import React from 'react';

import Button from '@erxes/ui/src/components/Button';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { __ } from '@erxes/ui/src/utils';

import { IJob } from '../../../../flow/types';
import { ScrolledContent } from '../../../styles';
import { ActionFooter } from './styles';

type Props = {
  closeModal: () => void;
  activeAction?: IJob;
  addAction: (
    action: IJob,
    actionId?: string,
    jobReferId?: string,
    description?: string,
    branchId?: string,
    departmentId?: string
  ) => void;
  jobReferId: string;
  description: string;
  branchId: string;
  departmentId: string;
  children: React.ReactNode;
};

function Common(props: Props) {
  const {
    addAction,
    activeAction,
    closeModal,
    jobReferId,
    children,
    description,
    branchId,
    departmentId
  } = props;

  const onSave = () => {
    addAction(
      activeAction,
      activeAction.id,
      jobReferId,
      description,
      branchId,
      departmentId
    );

    closeModal();
  };

  return (
    <ScrolledContent>
      {children}

      <ActionFooter>
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            {__('Cancel')}
          </Button>

          <Button btnStyle="success" icon="checked-1" onClick={onSave}>
            Save
          </Button>
        </ModalFooter>
      </ActionFooter>
    </ScrolledContent>
  );
}

export default Common;
