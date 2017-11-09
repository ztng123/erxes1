import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';
import { Wrapper } from '../../layout/components';
import { Button, Label, Icon, TaggerPopover } from 'modules/common/components';
import { BarItems } from 'modules/layout/styles';
import Conversation from './conversation/Conversation';
import { RespondBox } from '../containers';
import { PopoverButton } from '../styles';

class Inbox extends Component {
  componentDidMount() {
    this.node.scrollTop = this.node.scrollHeight;
  }

  componentDidUpdate() {
    this.node.scrollTop = this.node.scrollHeight;
  }

  render() {
    const { conversations, currentConversation, channels } = this.props;
    const actionBarLeft = <BarItems>Alice Caldwell</BarItems>;

    const tagTrigger = (
      <PopoverButton>
        <Label lblStyle="danger">urgent</Label>
        <Icon icon="ios-arrow-down" />
      </PopoverButton>
    );

    const actionBarRight = (
      <BarItems>
        <TaggerPopover
          targets={[currentConversation]}
          type="conversation"
          trigger={tagTrigger}
        />
        <Button btnStyle="success" size="small">
          <Icon icon="checkmark" /> Resolve
        </Button>
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar left={actionBarLeft} right={actionBarRight} invert />
    );

    const content = (
      <div
        style={{ height: '100%', overflow: 'auto', background: '#fafafa' }}
        ref={node => {
          this.node = node;
        }}
      >
        <Conversation conversation={currentConversation} />
      </div>
    );

    const breadcrumb = [
      { title: 'Inbox', link: '/inbox' },
      { title: 'Conversation' }
    ];

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        actionBar={actionBar}
        content={content}
        footer={
          <RespondBox
            conversation={currentConversation}
            setAttachmentPreview={() => {}}
          />
        }
        leftSidebar={
          <LeftSidebar channels={channels} conversations={conversations} />
        }
        rightSidebar={<RightSidebar />}
      />
    );
  }
}

Inbox.propTypes = {
  title: PropTypes.string,
  conversations: PropTypes.array,
  currentConversation: PropTypes.object,
  channels: PropTypes.array.isRequired
};

export default Inbox;
