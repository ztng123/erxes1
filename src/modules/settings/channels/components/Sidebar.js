import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from 'modules/layout/components';
import { ChannelList } from './';
import { SidebarList } from 'modules/layout/styles';
import { RightButton, Title } from '../styles';
import { ChannelForm } from '../containers';
import {
  Icon,
  ModalTrigger,
  Spinner,
  EmptyState
} from 'modules/common/components';

const propTypes = {
  channels: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.renderObjects = this.renderObjects.bind(this);
  }

  renderChannelName(props) {
    return <ChannelList {...props} />;
  }

  renderObjects() {
    const { channels, members, remove, save, refetch } = this.props;

    return channels.map(channel =>
      this.renderChannelName({
        key: channel._id,
        channel,
        members,
        remove,
        refetch,
        save
      })
    );
  }

  renderForm(props) {
    return <ChannelForm {...props} />;
  }

  render() {
    const { loading, save, channels } = this.props;

    const AddChannel = (
      <RightButton>
        <Icon icon="plus" />
      </RightButton>
    );

    return (
      <Wrapper.Sidebar full>
        <Wrapper.Sidebar.Section full>
          <Title>Channels</Title>
          <ModalTrigger title="New Channel" trigger={AddChannel}>
            {this.renderForm({ save })}
          </ModalTrigger>
          {channels.length ? (
            <SidebarList>{this.renderObjects()}</SidebarList>
          ) : (
            <div>
              <EmptyState
                text="There aren’t any channel at the moment."
                icon="network"
              />
            </div>
          )}
        </Wrapper.Sidebar.Section>
        {loading && <Spinner />}
      </Wrapper.Sidebar>
    );
  }
}

Sidebar.propTypes = propTypes;

export default Sidebar;
