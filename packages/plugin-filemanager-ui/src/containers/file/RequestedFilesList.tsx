import * as compose from 'lodash.flowright';

import {
  ConfirmRequestMutationResponse,
  RequestAccessMutationResponse
} from '../../types';
import { mutations, queries } from '../../graphql';

import { Alert } from '@erxes/ui/src/utils';
import React from 'react';
import RequestAccessForm from '../../components/file/RequestAccessForm';
import RequestedFileList from '../../components/file/RequestedFilesList';
import Spinner from '@erxes/ui/src/components/Spinner';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

type Props = {
  fileId: string;
};

type FinalProps = {
  getAccessRequestQuery: any;
} & Props &
  ConfirmRequestMutationResponse;

const RequestedFilesListContainer = ({
  confirmRequestMutation,
  getAccessRequestQuery
}: FinalProps) => {
  if (getAccessRequestQuery && getAccessRequestQuery.loading) {
    return <Spinner objective={true} />;
  }

  const onConfirm = (variables, callback) => {
    confirmRequestMutation({
      variables
    })
      .then(() => {
        Alert.success('Request confirmed!');

        if (callback) {
          callback();
        }
      })
      .catch(error => {
        Alert.error(error.message);

        if (callback) {
          callback();
        }
      });
  };

  const accessRequests =
    getAccessRequestQuery.filemanagerGetAccessRequests || ([] as any);

  return <RequestedFileList requests={accessRequests} onConfirm={onConfirm} />;
};

export default compose(
  graphql<Props>(gql(queries.filemanagerGetAccessRequests), {
    name: 'getAccessRequestQuery',
    options: ({ fileId }: { fileId: string }) => ({
      variables: {
        fileId
      }
    })
  }),
  graphql<Props, ConfirmRequestMutationResponse, {}>(
    gql(mutations.filemanagerConfirmAccessRequest),
    {
      name: 'confirmRequestMutation'
    }
  )
)(RequestedFilesListContainer);
