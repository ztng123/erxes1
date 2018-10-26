import gql from 'graphql-tag';
import { Spinner } from 'modules/common/components';
import { Sidebar } from 'modules/layout/components';
import { GenerateCustomFields } from 'modules/settings/properties/components';
import { FIELDS_GROUPS_CONTENT_TYPES } from 'modules/settings/properties/constants';
import { queries as fieldQueries } from 'modules/settings/properties/graphql';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from '../../../common/utils';
import { FieldsGroupsQueryResponse } from '../../../settings/properties/types';
import { mutations } from '../../graphql';
import { EditMutationResponse, ICustomer } from '../../types';

type Props = {
  customer: ICustomer;
  loading?: boolean;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  EditMutationResponse;

const CustomFieldsSection = (props: FinalProps) => {
  const { customer, customersEdit, fieldsGroupsQuery, loading } = props;

  if (fieldsGroupsQuery.loading) {
    return (
      <Sidebar full={true}>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = customer;

  const save = (variables, callback) => {
    customersEdit({
      variables: { _id, ...variables }
    })
      .then(() => {
        callback();
      })
      .catch(e => {
        callback(e);
      });
  };

  const updatedProps = {
    save,
    loading,
    customFieldsData: customer.customFieldsData || {},
    fieldsGroups: fieldsGroupsQuery.fieldsGroups || []
  };

  return <GenerateCustomFields {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse, { contentType: string }>(
      gql(fieldQueries.fieldsGroups),
      {
        name: 'fieldsGroupsQuery',
        options: () => ({
          variables: {
            contentType: FIELDS_GROUPS_CONTENT_TYPES.CUSTOMER
          }
        })
      }
    ),

    // mutations
    graphql<Props, EditMutationResponse, ICustomer>(
      gql(mutations.customersEdit),
      {
        name: 'customersEdit',
        options: () => ({
          refetchQueries: ['customerDetail']
        })
      }
    )
  )(CustomFieldsSection)
);
