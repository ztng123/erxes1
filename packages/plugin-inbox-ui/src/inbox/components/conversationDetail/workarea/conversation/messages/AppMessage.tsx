import Button from '@erxes/ui/src/components/Button';
import NameCard from '@erxes/ui/src/components/nameCard/NameCard';
import React from 'react';
import { IMessage } from '@erxes/ui-inbox/src/inbox/types';
import { AppMessageBox, CallButton, FlexItem, UserInfo } from '@erxes/ui-inbox/src/inbox/components/conversationDetail/workarea/conversation/styles';

type Props = {
  message: IMessage;
};

export default class AppMessage extends React.Component<Props, {}> {
  render() {
    const { messengerAppData = {} } = this.props.message;
    const customerName =
      messengerAppData.customer && messengerAppData.customer.firstName;

    return (
      <FlexItem>
        <AppMessageBox>
          <UserInfo>
            <NameCard.Avatar customer={messengerAppData.customer} size={60} />
            <h4>Meet with {customerName}</h4>
          </UserInfo>
          <CallButton>
            <h5>Meeting Ready</h5>
            <a
              href={messengerAppData.hangoutLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Join Call</Button>
            </a>
          </CallButton>
        </AppMessageBox>
      </FlexItem>
    );
  }
}
