import { __ } from 'modules/common/utils';
import { Wrapper } from 'modules/layout/components';
import Sidebar from 'modules/settings/integrations/components/Sidebar';
import { INTEGRATIONS } from 'modules/settings/integrations/constants';
import * as React from 'react';
import Row from './Row';
import { IntegrationWrapper } from './styles';

type Props = {
  totalCount: {
    messenger: number;
    form: number;
    twitter: number;
    facebook: number;
    gmail: number;
  };
  messengerAppsCount: number;
  queryParams: any;
};

class Home extends React.Component<Props> {
  renderContent() {
    const { totalCount, messengerAppsCount, queryParams } = this.props;

    return (
      <IntegrationWrapper>
        {INTEGRATIONS.map(obj => (
          <Row
            key={obj.name}
            title={obj.title}
            integrations={obj.rows}
            totalCount={totalCount}
            messengerAppsCount={messengerAppsCount}
            queryParams={queryParams}
          />
        ))}
      </IntegrationWrapper>
    );
  }

  render() {
    const breadcrumb = [{ title: __('App store') }];

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        leftSidebar={<Sidebar />}
        content={this.renderContent()}
      />
    );
  }
}

export default Home;
