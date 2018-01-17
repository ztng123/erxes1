import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Sidebar as LeftSidebar } from 'modules/layout/components';
import { SidebarList as List } from 'modules/layout/styles';
import { ChannelRow } from './';
import { RightButton, Title } from '../styles';
import { ChannelForm } from '../containers';
import {
  Icon,
  ModalTrigger,
  EmptyState,
  LoadMore,
  Spinner
} from 'modules/common/components';

const propTypes = {
  channels: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  currentChannelId: PropTypes.string,
  channelsTotalCount: PropTypes.number.isRequired
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.renderItems = this.renderItems.bind(this);
  }

  renderItems() {
    const { channels, members, remove, save, currentChannelId } = this.props;

    return channels.map(channel => (
      <ChannelRow
        key={channel._id}
        isActive={currentChannelId === channel._id}
        channel={channel}
        members={members}
        remove={remove}
        save={save}
      />
    ));
  }

  renderChannelForm(props) {
    return <ChannelForm {...props} />;
  }

  renderSidebarHeader() {
    const { save, members } = this.props;

    const AddChannel = (
      <RightButton>
        <Icon icon="plus" />
      </RightButton>
    );

    return (
      <LeftSidebar.Header>
        <Title>Channels</Title>
        <ModalTrigger title="New Channel" trigger={AddChannel}>
          {this.renderChannelForm({ save, members })}
        </ModalTrigger>
      </LeftSidebar.Header>
    );
  }

  render() {
    const { loading, channelsTotalCount } = this.props;

    return (
      <LeftSidebar full header={this.renderSidebarHeader()}>
        <List>
          {this.renderItems()}
          <LoadMore all={channelsTotalCount} />
        </List>
        {loading && <Spinner />}
        {!loading &&
          channelsTotalCount === 0 && (
            <EmptyState icon="briefcase" text="There is no channel" />
          )}
      </LeftSidebar>
    );
  }
}

Sidebar.propTypes = propTypes;

export default Sidebar;
