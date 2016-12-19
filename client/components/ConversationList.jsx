import React, { PropTypes } from 'react';
import TopBar from './TopBar.jsx';
import ConversationItem from './ConversationItem.jsx';


const propTypes = {
  data: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired,
  createConversation: PropTypes.func.isRequired,
  goToConversation: PropTypes.func.isRequired,
};

function ConversationList({ data, notifications, createConversation, goToConversation }) {
  if (data.loading) {
    return null;
  }

  const title = (
    <div className="erxes-topbar-title">
      <div>Conversations</div>
      <span>with Support staffs</span>
    </div>
  );

  return (
    <div className="erxes-messenger">
      <TopBar
        middle={title}
        buttonClass="new"
        onButtonClick={createConversation}
      />
      <ul className="erxes-conversation-list">
        {
          data.conversations.map(conversation =>
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              notificationCount={notifications[conversation._id]}
              goToConversation={goToConversation}
            />
          )
        }
      </ul>
    </div>
  );
}

ConversationList.propTypes = propTypes;

export default ConversationList;
