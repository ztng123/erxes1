import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
// erxes
import Spinner from '@erxes/ui/src/components/Spinner';
// local
import Component from '../../components/messages/MessageList';
import { queries, subscriptions } from '../../graphql';
import { Alert } from '@erxes/ui/src/utils';
import { sendDesktopNotification } from '@erxes/ui/src/utils/core';
import strip from 'strip';
import { IUser } from '@erxes/ui/src/auth/types';

type Props = {
  chatId: string;
  setReply: (message: any) => void;
  currentUser: IUser;
};

const MessageListContainer = (props: Props) => {
  const { chatId, currentUser } = props;

  const [page, setPage] = useState<number>(0);
  const [latestMessages, setLatestMessages] = useState<any[]>([]);
  const { loading, error, data, refetch, fetchMore } = useQuery(
    gql(queries.chatMessages),
    {
      variables: { chatId, skip: 0 }
    }
  );
  const {
    loading: notificationLoading,
    error: notificationError,
    data: notificationData
  } = useQuery(gql(queries.notificationsGetConfigurations), {});

  useEffect(() => {
    refetch();
    setLatestMessages([]);
    setPage(0);
  }, [chatId]);

  useSubscription(gql(subscriptions.chatMessageInserted), {
    variables: { chatId },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (!data) {
        return null;
      }
      const { chatMessageInserted } = data;
      const { content, mentionedUserIds } = chatMessageInserted;
      const { notificationsGetConfigurations } = notificationData;

      setLatestMessages([data.chatMessageInserted, ...latestMessages]);

      notificationsGetConfigurations?.map(
        (notificationsGetConfiguration: any) => {
          if (
            notificationsGetConfiguration.isAllowed &&
            notificationsGetConfiguration.notifType === 'chatMention'
          ) {
            mentionedUserIds.map((mentionedUserId: string) => {
              if (currentUser._id === mentionedUserId) {
                sendDesktopNotification({
                  title: 'You mentioned in chats',
                  content: strip(content || '')
                });
                return;
              }
            });
          }
          if (
            notificationsGetConfiguration.isAllowed &&
            notificationsGetConfiguration.notifType === 'chatReceive'
          ) {
            sendDesktopNotification({
              title: 'Chat recieved',
              content: strip(content || '')
            });
            return;
          }
        }
      );
    }
  });

  const loadEarlierMessage = () => {
    const nextPage = page + 1;

    if (chatMessages.length < nextPage * 20) {
      return;
    }

    const skip: number =
      nextPage * 20 + (latestMessages && latestMessages.length);

    fetchMore({
      variables: {
        chatId,
        skip
      },
      updateQuery(prev, { fetchMoreResult }) {
        const result = fetchMoreResult.chatMessages.list || [];

        if (result.length > 0) {
          setPage(nextPage);

          return {
            ...prev,
            chatMessages: {
              ...prev.chatMessages,
              list: [...prev.chatMessages.list, ...result]
            }
          };
        }

        return prev;
      }
    });
  };

  if (loading || notificationLoading) {
    return <Spinner />;
  }

  if (error || notificationError) {
    Alert.error(error.message);
  }

  const chatMessages = (data && data.chatMessages.list) || [];

  return (
    <Component
      messages={chatMessages}
      latestMessages={latestMessages}
      isAllMessages={chatMessages.length < (page + 1) * 20}
      setReply={props.setReply}
      loadEarlierMessage={loadEarlierMessage}
    />
  );
};

export default MessageListContainer;
