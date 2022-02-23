import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';

import { Alert, confirm } from '@erxes/ui/src/utils';
import { mutations } from '@erxes/ui-team/src/graphql';
import Item from '../../components/department/Item';
import { IDepartment } from '@erxes/ui-team/src/types';

type Props = {
  department: IDepartment;
  refetch: () => void;
  level?: number;
};

export default function ItemContainer(props: Props) {
  const [deleteMutation] = useMutation(gql(mutations.departmentsRemove));

  const deleteDepartment = (_id: string, callback: () => void) => {
    confirm().then(() => {
      deleteMutation({ variables: { _id } })
        .then(() => {
          callback();

          Alert.success('Successfully deleted');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  return <Item {...props} deleteDepartment={deleteDepartment} />;
}
