import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from '../../layout/components';
import { ConversationList } from '../../common/components';

import { conversations } from '../datas';

const propTypes = {
  conversations: PropTypes.array.isRequired
};

class Sidebar extends Component {
  renderSidebarHeader() {
    return (
      <Wrapper.Sidebar.Header>
        <div># Sales (13)</div>
        <div>Open</div>
      </Wrapper.Sidebar.Header>
    );
  }

  renderSidebarFooter() {
    return (
      <Wrapper.Sidebar.Footer>
        <div>Brand</div>
        <div>Integration</div>
        <div>Tag</div>
      </Wrapper.Sidebar.Footer>
    );
  }

  render() {
    const Sidebar = Wrapper.Sidebar;

    // const { conversation } = this.props;
    // const { integration = {} } = conversation;
    // const { brand = {}, channels = [] } = integration;

    return (
      <Sidebar
        wide
        full
        header={this.renderSidebarHeader()}
        footer={this.renderSidebarFooter()}
      >
        <ConversationList
          conversations={conversations}
          user={conversations[0].user}
        />
      </Sidebar>
    );
  }
}

Sidebar.propTypes = propTypes;

export default Sidebar;
