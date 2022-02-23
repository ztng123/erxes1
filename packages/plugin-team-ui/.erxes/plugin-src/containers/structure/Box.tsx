import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

import { queries } from '@erxes/ui-team/src/graphql';
import StructureBox from '../../components/structure/Box';

import Box from '@erxes/ui/src/components/Box';
import Spinner from '@erxes/ui/src/components/Spinner';
import ErrorMsg from '@erxes/ui/src/components/ErrorMsg';
import { __ } from 'coreui/utils';
import { MenuFooter } from '@erxes/ui-cards/src/boards/styles/rightMenu';

export default function BoxContainer() {
  const { data, loading, error, refetch } = useQuery(
    gql(queries.structureDetail),
    {
      fetchPolicy: 'network-only'
    }
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box isOpen={true} title={__('Structure')} name="showStructure">
        <MenuFooter>
          <ErrorMsg>{error.message}</ErrorMsg>
        </MenuFooter>
      </Box>
    );
  }

  return <StructureBox refetch={refetch} structure={data.structureDetail} />;
}
