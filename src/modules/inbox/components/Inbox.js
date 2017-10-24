import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';
import { Wrapper } from '../../layout/components';
import { Button, Label, Icon } from '../../common/components';
import Conversation from './conversation/Conversation';

class Inbox extends Component {
  render() {
    const { conversations, messages, user } = this.props;
    const actionBarLeft = <div>Alice Caldwell</div>;

    const actionBarRight = (
      <div>
        <Label lblStyle="danger">urgent</Label>
        <Button btnStyle="success">
          <Icon icon="checkmark" />Resolve
        </Button>
      </div>
    );

    const actionBar = (
      <Wrapper.ActionBar left={actionBarLeft} right={actionBarRight} />
    );

    const content = (
      <div
        className="scroll-area"
        ref={node => {
          this.node = node;
        }}
      >
        <Conversation messages={messages} />
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
        footer={<div />}
        leftSidebar={<LeftSidebar conversations={conversations} />}
        rightSidebar={<RightSidebar user={user} />}
      />
    );
  }
}

Inbox.propTypes = {
  title: PropTypes.string,
  conversations: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};

export default Inbox;
