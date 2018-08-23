import React from 'react';
import client from 'apolloClient';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Bulk } from 'modules/common/components';
import { Alert, uploadHandler } from 'modules/common/utils';
import { KIND_CHOICES } from 'modules/settings/integrations/constants';
import { queries as brandQueries } from 'modules/settings/brands/graphql';
import { TAG_TYPES } from 'modules/tags/constants';
import { queries as tagQueries } from 'modules/tags/graphql';
import { CustomersList } from '../components';
import { mutations, queries } from '../graphql';

class CustomerListContainer extends Bulk {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      loading: false
    };
  }

  refetch() {
    this.props.customersMainQuery.refetch();
    this.props.customerCountsQuery.refetch();
  }

  render() {
    const {
      customersMainQuery,
      brandsQuery,
      tagsQuery,
      customerCountsQuery,
      customersListConfigQuery,
      customersRemove,
      customersMerge,
      history
    } = this.props;

    const { __ } = this.context;

    let columnsConfig =
      customersListConfigQuery.fieldsDefaultColumnsConfig || [];

    // load config from local storage
    const localConfig = localStorage.getItem('erxes_customer_columns_config');

    if (localConfig) {
      columnsConfig = JSON.parse(localConfig);
    }

    const removeCustomers = ({ customerIds }) => {
      customersRemove({
        variables: { customerIds }
      })
        .then(() => {
          this.emptyBulk();
          Alert.success('Success');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const mergeCustomers = ({ ids, data, callback }) => {
      customersMerge({
        variables: {
          customerIds: ids,
          customerFields: data
        }
      })
        .then(data => {
          callback();
          Alert.success('Success');
          history.push(`/customers/details/${data.data.customersMerge._id}`);
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const exportCustomers = bulk => {
      const { queryParams } = this.props;

      if (bulk.length > 0) {
        queryParams.ids = bulk.map(customer => customer._id);
      }

      this.setState({ loading: true });

      client
        .query({
          query: gql(queries.customersExport),
          variables: { ...queryParams }
        })
        .then(({ data }) => {
          this.setState({ loading: false });
          window.open(data.customersExport, '_blank');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    };

    const handleXlsUpload = e => {
      const xlsFile = e.target.files;

      uploadHandler({
        type: 'import',
        files: xlsFile,
        extraFormData: [{ key: 'type', value: 'customers' }],
        url: `${process.env.REACT_APP_API_URL}/import-file`,
        responseType: 'json',
        beforeUpload: () => {
          this.setState({ loading: true });
        },

        afterUpload: ({ response }) => {
          if (response.length === 0) {
            customersMainQuery.refetch();
            Alert.success(__('All customers imported successfully'));
          } else {
            Alert.error(response[0]);
          }

          this.setState({ loading: false });
        }
      });

      e.target.value = null;
    };

    const searchValue = this.props.queryParams.searchValue || '';

    const { list = [], totalCount = 0 } =
      customersMainQuery.customersMain || {};

    const counts = customerCountsQuery.customerCounts || {
      byBrand: {},
      byIntegrationType: {},
      bySegment: {},
      byTag: {},
      byForm: {},
      byLeadStatus: {},
      byLifecycleState: {}
    };

    const updatedProps = {
      ...this.props,
      columnsConfig,
      customers: list,
      counts: {
        all: totalCount,
        ...counts
      },
      exportCustomers,
      handleXlsUpload,
      brands: brandsQuery.brands || [],
      integrations: KIND_CHOICES.ALL_LIST,
      tags: tagsQuery.tags || [],
      bulk: this.state.bulk || [],
      isAllSelected: this.state.isAllSelected,
      emptyBulk: this.emptyBulk,
      toggleBulk: this.toggleBulk,
      toggleAll: this.toggleAll,
      searchValue,
      loading: customersMainQuery.loading || this.state.loading,
      loadingTags: tagsQuery.loading,
      mergeCustomers,
      removeCustomers
    };

    return <CustomersList {...updatedProps} />;
  }
}

CustomerListContainer.propTypes = {
  customersQuery: PropTypes.object,
  tagsQuery: PropTypes.object,
  brandsQuery: PropTypes.object,
  customerCountsQuery: PropTypes.object,
  history: PropTypes.object
};

CustomerListContainer.contextTypes = {
  __: PropTypes.func
};

const generateParams = ({ queryParams }) => {
  return {
    variables: {
      page: queryParams.page,
      perPage: queryParams.perPage || 20,
      segment: queryParams.segment,
      tag: queryParams.tag,
      ids: queryParams.ids,
      searchValue: queryParams.searchValue,
      brand: queryParams.brand,
      integration: queryParams.integrationType,
      form: queryParams.form,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      leadStatus: queryParams.leadStatus,
      lifecycleState: queryParams.lifecycleState,
      sortField: queryParams.sortField,
      sortDirection: queryParams.sortDirection
    },
    fetchPolicy: 'network-only'
  };
};

export default compose(
  graphql(gql(queries.customersMain), {
    name: 'customersMainQuery',
    options: generateParams
  }),
  graphql(gql(queries.customerCounts), {
    name: 'customerCountsQuery',
    options: generateParams
  }),
  graphql(gql(tagQueries.tags), {
    name: 'tagsQuery',
    options: () => ({
      variables: {
        type: TAG_TYPES.CUSTOMER
      },
      fetchPolicy: 'network-only'
    })
  }),
  graphql(gql(queries.customersListConfig), {
    name: 'customersListConfigQuery',
    options: () => ({
      fetchPolicy: 'network-only'
    })
  }),
  graphql(gql(brandQueries.brands), {
    name: 'brandsQuery',
    options: () => ({
      fetchPolicy: 'network-only'
    })
  }),

  // mutations
  graphql(gql(mutations.customersRemove), {
    name: 'customersRemove'
  }),
  graphql(gql(mutations.customersMerge), {
    name: 'customersMerge',
    options: props => ({
      refetchQueries: ['customersMain', 'customerCounts']
    })
  })
)(withRouter(CustomerListContainer));
