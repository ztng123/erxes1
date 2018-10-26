import gql from 'graphql-tag';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Settings } from '../components';
import { queries } from '../graphql';
import { VersionsQueryResponse } from '../types';

type Props = {
  versionsQuery: VersionsQueryResponse;
};

const SettingsContainer = (props: Props) => {
  const { versionsQuery } = props;

  const updatedProps = {
    ...props,
    versions: versionsQuery.versions || {}
  };

  return <Settings {...updatedProps} />;
};

export default compose(
  graphql(gql(queries.versions), {
    name: 'versionsQuery'
  })
)(SettingsContainer);
