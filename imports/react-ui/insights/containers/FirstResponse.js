import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { Loading } from '/imports/react-ui/common';
import { FirstResponse } from '../components';
import { queries } from '../graphql';

const FirstResponseReportContainer = props => {
  const { brandsQuery, firstResponseQuery, queryParams } = props;

  if (brandsQuery.loading || firstResponseQuery.loading) {
    return <Loading title="First Response Report" />;
  }

  const data = firstResponseQuery.insightsFirstResponse;
  const updatedProps = {
    queryParams,
    trend: data.trend,
    time: data.time,
    teamMembers: data.teamMembers,
    brands: brandsQuery.brands,
  };

  return <FirstResponse {...updatedProps} />;
};

FirstResponseReportContainer.propTypes = {
  queryParams: PropTypes.object,
  brandsQuery: PropTypes.object,
  firstResponseQuery: PropTypes.object,
};

export default compose(
  graphql(gql(queries.firstResponse), {
    name: 'firstResponseQuery',
    options: ({ queryParams }) => ({
      fetchPolicy: 'network-only',
      variables: {
        brandId: queryParams.brandId,
        integrationType: queryParams.integrationType,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      },
    }),
  }),
  graphql(gql(queries.brands), { name: 'brandsQuery' }),
)(FirstResponseReportContainer);
