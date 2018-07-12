import { connection } from './connection';

const messageFields = `
  _id
  conversationId
  user {
    _id
    details {
      avatar
      fullName
    }
  }
  content
  createdAt
  internal
  engageData {
    content
    kind
    sentAs
    fromUser {
      details {
        fullName
        avatar
      }
    }
    messageId
    brandId
  }
  attachments
`;


const conversationDetailQuery = `
  query ($_id: String!) {
    conversationDetail(_id: $_id) {
      _id
      content
      messages {
        ${messageFields}
      }
    }
  }
`;

const messengerSupportersQuery = `
  query ($integrationId: String!) {
    messengerSupporters(integrationId: $integrationId) {
      _id
      details {
        avatar
        fullName
      }
    }
  }
`;

const isMessengerOnlineQuery = `
  query ($integrationId: String!) {
    isMessengerOnline(integrationId: $integrationId)
  }
`;

const conversationMessageInserted = `
  subscription conversationMessageInserted($_id: String!) {
    conversationMessageInserted(_id: $_id) {
      ${messageFields}
    }
  }
`;

const unreadCountQuery = `
  query unreadCount($conversationId: String) {
    unreadCount(conversationId: $conversationId)
  }
`;

const conversationsChangedSubscription = `
  subscription conversationsChanged($customerId: String) {
    conversationsChanged(customerId: $customerId) {
      type
    }
  }
`;

const conversationChanged = `
  subscription conversationChanged($_id: String!) {
    conversationChanged(_id: $_id) {
      type
    }
  }
`;

const allConversations = `
  query allConversations(${connection.queryVariables}) {
    conversations(${connection.queryParams}) {
      _id
      content
      createdAt
      participatedUsers {
        details {
          fullName
          avatar
        }
      }
    }
  }
`;

const unreadInfo = `
  query unreadInfo(${connection.queryVariables}) {
    unreadInfo(${connection.queryParams}) {
      lastUnreadMessage {
        ${messageFields}
      }

      totalCount
    }
  }
`;

const readConversationMessages = `
  mutation readConversationMessages($conversationId: String) {
    readConversationMessages(conversationId: $conversationId)
  }
`;

const connect = `
  mutation connect($brandCode: String!, $email: String, $phone: String,
    $isUser: Boolean, $data: JSON,
    $companyData: JSON, $cachedCustomerId: String) {
    messengerConnect(brandCode: $brandCode, email: $email, phone: $phone,
      isUser: $isUser, data: $data, companyData: $companyData,
      cachedCustomerId: $cachedCustomerId) {
      integrationId,
      messengerData,
      languageCode,
      uiOptions,
      customerId,
    }
  }
`;

const saveBrowserInfo = `
  mutation saveBrowserInfo($customerId: String!  $browserInfo: JSON!) {
    saveBrowserInfo(customerId: $customerId browserInfo: $browserInfo) {
      _id
    }
  }
`;

export default {
  messageFields,
  conversationDetailQuery,
  messengerSupportersQuery,
  isMessengerOnlineQuery,
  unreadCountQuery,
  conversationMessageInserted,
  conversationChanged,
  conversationsChangedSubscription,
  allConversations,
  unreadInfo,
  connect,
  saveBrowserInfo,
  readConversationMessages,
}
