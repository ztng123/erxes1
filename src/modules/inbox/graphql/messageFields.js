export default `
  _id
  content
  attachments
  mentionedUserIds
  conversationId
  internal
  customerId
  userId
  createdAt
  isCustomerRead
  engageData
  formWidgetData
  facebookData
  user {
    _id
    username
    details {
      avatar
      fullName
      position
      twitterUsername
    }
  }
  customer {
    _id
    name
  }
`;
