import gql from 'graphql-tag';
import client from '@erxes/ui/src/apolloClient';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { graphql } from 'react-apollo';
import { Alert, confirm } from '@erxes/ui/src/utils';
import { commonListComposer } from '@erxes/ui/src/utils';
import List from '../components/List';
import { mutations, queries } from '@erxes/ui-settings/src/responseTemplates/graphql';
import { RESPONSE_TEMPLATE_STATUSES } from '../constants';
import React from 'react';
import {
  ICommonFormProps,
  ICommonListProps
} from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = ICommonListProps &
  ICommonFormProps & {
    queryParams: any;
    history: any;
    renderButton: (props: IButtonMutateProps) => JSX.Element;
    listQuery: any;
  };

class ResponseListContainer extends React.Component<Props> {
  changeStatus = (_id: string, status: string) => {
    const isActive =
      status === null || status === RESPONSE_TEMPLATE_STATUSES.ACTIVE;
    const message = isActive
      ? 'You are going to archive this response template. Are you sure?'
      : 'You are going to active this response template. Are you sure?';

    const statusAction = isActive
      ? RESPONSE_TEMPLATE_STATUSES.ACTIVE
      : RESPONSE_TEMPLATE_STATUSES.ARCHIVED;

    confirm(message).then(() => {
      client
        .mutate({
          mutation: gql(mutations.responseTemplatesChangeStatus),
          variables: { _id, status }
        })
        .then(({ data }) => {
          const template = data.responseTemplatesChangeStatus;

          if (template && template._id) {
            Alert.success(`Response template has been ${statusAction}.`);
            this.props.listQuery.refetch();
          }
        })
        .catch(e => {
          Alert.error(e.message);
        });
    });
  };

  render() {
    return <List {...this.props} changeStatus={this.changeStatus} />;
  }
}

export default commonListComposer<Props>({
  text: 'response template',
  label: 'responseTemplates',
  stringEditMutation: mutations.responseTemplatesEdit,
  stringAddMutation: mutations.responseTemplatesAdd,

  gqlListQuery: graphql(gql(queries.responseTemplates), {
    name: 'listQuery',
    options: ({ queryParams }: { queryParams: any }) => {
      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          searchValue: queryParams.searchValue,
          brandId: queryParams.brandId,
          status: queryParams.status,
          ...generatePaginationParams(queryParams)
        }
      };
    }
  }),

  gqlTotalCountQuery: graphql(gql(queries.responseTemplatesTotalCount), {
    name: 'totalCountQuery',
    options: ({ queryParams }: { queryParams: any }) => {
      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          searchValue: queryParams.searchValue,
          brandId: queryParams.brandId
        }
      };
    }
  }),

  gqlAddMutation: graphql(gql(mutations.responseTemplatesAdd), {
    name: 'addMutation'
  }),

  gqlEditMutation: graphql(gql(mutations.responseTemplatesEdit), {
    name: 'editMutation'
  }),

  gqlRemoveMutation: graphql(gql(mutations.responseTemplatesRemove), {
    name: 'removeMutation'
  }),

  ListComponent: ResponseListContainer
});
