import React from 'react';

import Leftbar from './Leftbar';
import PluginPreview from './PluginPreview';
import Wrapper from '../containers/Wrapper';

import { ImageWrapper } from '../styles';

type FinalProps = {
  manageInstall;
  enabledServicesQuery;
};

class Installer extends React.Component<FinalProps> {
  renderContent() {
    const { manageInstall, enabledServicesQuery } = this.props;
    return (
      <>
        <ImageWrapper>
          <span>Product Experience management template</span>
          <img src="/images/marketplace.png" alt="installer" />
        </ImageWrapper>
        <PluginPreview
          manageInstall={manageInstall}
          enabledServicesQuery={enabledServicesQuery}
        />
      </>
    );
  }

  render() {
    return <Wrapper content={this.renderContent()} leftSidebar={<Leftbar />} />;
  }
}

export default Installer;
