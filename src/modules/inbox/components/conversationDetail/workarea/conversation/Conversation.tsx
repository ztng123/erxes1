import { Spinner } from 'modules/common/components';
import { IAttachmentPreview } from 'modules/common/types';
import { FacebookConversation } from 'modules/inbox/containers/conversationDetail';
import * as React from 'react';
import styled from 'styled-components';
import { IConversation, IMessage } from '../../../../types';
import AttachmentPreview from './AttachmentPreview';
import { Message } from './messages';
import { TwitterConversation } from './twitter';

type Props = {
  conversation: IConversation;
  conversationMessages: IMessage[];
  fetchFacebook: (
    { commentId, postId }: { commentId?: string; postId?: string }
  ) => void;
  attachmentPreview: IAttachmentPreview;
  scrollBottom: () => void;
  loading: boolean;
};

const Wrapper = styled.div`
  padding: 20px;
  overflow: hidden;
  min-height: 80px;

  > div:first-child {
    margin-top: 0;
  }
`;

class Conversation extends React.Component<Props, {}> {
  renderMessages(messages: IMessage[], conversationFirstMessage: IMessage) {
    const rows: React.ReactNode[] = [];

    let tempId;

    messages.forEach(message => {
      rows.push(
        <Message
          isSameUser={
            message.userId
              ? message.userId === tempId
              : message.customerId === tempId
          }
          conversationFirstMessage={conversationFirstMessage}
          message={message}
          key={message._id}
        />
      );

      tempId = message.userId ? message.userId : message.customerId;
    });

    return rows;
  }

  renderConversation() {
    const {
      loading,
      conversation,
      conversationMessages,
      scrollBottom,
      fetchFacebook
    } = this.props;
    const { kind } = conversation.integration;

    if (!conversation) {
      return null;
    }

    if ((kind === 'facebook' || kind === 'twitter') && loading) {
      return <Spinner objective={true} />;
    }

    const twitterData = conversation.twitterData;
    const facebookData = conversation.facebookData;
    const isTweet = twitterData && !twitterData.isDirectMessage;
    const isFacebookPost = facebookData && facebookData.kind !== 'messenger';

    if (isTweet) {
      return (
        <TwitterConversation
          conversation={conversation}
          conversationMessages={conversationMessages}
          scrollBottom={scrollBottom}
        />
      );
    }

    if (isFacebookPost) {
      return (
        <FacebookConversation
          conversation={conversation}
          scrollBottom={scrollBottom}
        />
      );
    }

    const messages = (conversationMessages || []).slice();
    const firstMessage = messages[0];

    return this.renderMessages(messages, firstMessage);
  }

  render() {
    const { attachmentPreview, scrollBottom } = this.props;

    return (
      <Wrapper>
        {this.renderConversation()}
        <AttachmentPreview
          onLoad={scrollBottom}
          attachmentPreview={attachmentPreview}
        />
      </Wrapper>
    );
  }
}

export default Conversation;
