import { useMutation, useQuery } from '@apollo/client';
import { router } from '@erxes/ui/src';
import Bulk from '@erxes/ui/src/components/Bulk';
import React from 'react';
import List from '../components/invoice/List';
import { mutations, queries } from '../graphql';
import {
  InvoicesQueryResponse,
  InvoicesTotalCountQueryResponse
} from '../types';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

const InvoiceListContainer = (props: Props) => {
  const { queryParams } = props;

  const invoicesQuery = useQuery<InvoicesQueryResponse>(queries.invoices, {
    variables: {
      ...router.generatePaginationParams(props.queryParams || {})
    },
    fetchPolicy: 'network-only'
  });

  const invoicesTotalCountQuery = useQuery<InvoicesTotalCountQueryResponse>(
    queries.invoicesTotalCount,
    {
      variables: {
        searchValue: queryParams.searchValue,
        kind: queryParams.kind,
        status: queryParams.status
      },
      fetchPolicy: 'network-only'
    }
  );

  const [invoiceCheck] = useMutation(mutations.checkInvoice, {
    refetchQueries: [
      {
        query: queries.invoices,
        variables: {
          ...router.generatePaginationParams(props.queryParams || {})
        }
      }
    ]
  });

  const checkInvoice = (invoiceId: string) => {
    invoiceCheck({
      variables: {
        _id: invoiceId
      }
    });
  };

  if (invoicesQuery.loading || invoicesTotalCountQuery.loading) {
    return false;
  }

  const invoices = (invoicesQuery.data && invoicesQuery.data.invoices) || [];

  const counts = (invoicesTotalCountQuery.data &&
    invoicesTotalCountQuery.data.invoicesTotalCount) || {
    total: 0
  };

  const updatedProps = {
    ...props,
    queryParams,
    invoices,
    loading: invoicesQuery.loading,
    searchValue: props.queryParams.searchValue || '',
    check: checkInvoice,
    counts
  };

  const invoiceList = listProps => {
    return <List {...updatedProps} {...listProps} />;
  };

  const refetch = () => {
    invoicesQuery.refetch();
    invoicesTotalCountQuery.refetch();
  };

  return <Bulk content={invoiceList} refetch={refetch} />;
};

export default InvoiceListContainer;
