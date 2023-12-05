import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { mutations, queries } from '../graphql';
import { ConfigsQueryResponse, IConfigsMap } from '../types';

type Props = {
  component: any;
  configCode: string;
};
type FinalProps = {
  configsQuery: ConfigsQueryResponse;
  updateConfigs: (configsMap: IConfigsMap) => Promise<void>;
} & Props;

class SettingsContainer extends React.Component<FinalProps> {
  render() {
    const { updateConfigs, configsQuery } = this.props;

    // create or update action
    const save = (map: IConfigsMap) => {
      updateConfigs({
        variables: { configsMap: map }
      })
        .then(() => {
          configsQuery.refetch();

          Alert.success(
            'You successfully updated stage in syncerkhet settings'
          );
        })
        .catch(error => {
          Alert.error(error.message);
        });
    };

    const config = configsQuery.configsGetValue || [];

    const configsMap = { [config.code]: config.value };

    const Component = this.props.component;

    const updatedProps = {
      ...this.props,
      configsMap,
      save,
      loading: configsQuery.loading
    };

    return <Component {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, ConfigsQueryResponse>(gql(queries.configs), {
      name: 'configsQuery',
      options: props => ({
        variables: {
          code: props.configCode
        }
        // fetchPolicy: 'network-only'
      })
    }),
    graphql<{}>(gql(mutations.updateConfigs), {
      name: 'updateConfigs'
    })
  )(SettingsContainer)
);
