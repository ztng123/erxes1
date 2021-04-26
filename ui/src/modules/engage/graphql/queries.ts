const listParamsDef = `
  $kind: String
  $status: String
  $tag: String
  $ids: String
  $page: Int
  $perPage: Int
`;

const listParamsValue = `
  kind: $kind
  status: $status
  tag: $tag
  ids: $ids
  page: $page
  perPage: $perPage
`;

const tagFields = `
  _id
  name
  colorCode
`;

const commonFields = `
  _id
  title
  kind
  isDraft
  isLive
  createdAt
  method
  tagIds
  customerTagIds
  brandIds
  segmentIds
  stats
  messenger
  email
  smsStats
  createdUser

  brand {
    _id
    name
  }

  totalCustomersCount
  validCustomersCount

  fromUser {
    _id
    email
    details {
      avatar
      fullName
      position
    }
  }
  shortMessage {
    from
    content
    fromIntegrationId
  }

  scheduleDate {
    type
    dateTime
  }
`;

const engageMessages = `
  query engageMessages(${listParamsDef}) {
    engageMessages(${listParamsValue}) {
      ${commonFields}

      brands {
        _id
        name
      }
      segments {
        _id
        name
      }
      getTags {
        ${tagFields}
      }
      customerTags {
        ${tagFields}
      }
    }
  }
`;

export const engageDetailFields = `
  ${commonFields}

  customerIds
  fromUserId
  stopDate

  scheduleDate {
    type
    month
    day
    dateTime
  }
  brand {
    name
  }
  customerTags {
    ${tagFields}
  }
`;

const engageMessageStats = `
  query engageMessageDetail($_id: String) {
    engageMessageDetail(_id: $_id){
      ${engageDetailFields}
      stats
      logs

      fromIntegration {
        name
      }
    }
  }
`;

const engageMessageDetail = `
  query engageMessageDetail($_id: String) {
    engageMessageDetail(_id: $_id){
      ${engageDetailFields}
    }
  }
`;

const users = `
  query users {
    allUsers(isActive: true) {
      _id
      username
      email
      details {
        avatar
        fullName
        position
        operatorPhone
      }
    }
  }
`;

const userDetail = `
  query userDetail($_id: String) {
    userDetail(_id: $_id) {
      _id
      username
      details {
        avatar
        fullName
        position
      }
      email
    }
  }
`;

const engageMessagesTotalCount = `
  query engageMessagesTotalCount(${listParamsDef}) {
    engageMessagesTotalCount(${listParamsValue})
  }
`;

const customerCounts = `
  query customerCounts(
    $page: Int,
    $perPage: Int,
    $segment: String,
    $brand: String,
    $tag: String,
    $ids: [String],
    $source: String,
    $only: String
  ) {
    customerCounts(
      page: $page,
      perPage: $perPage,
      segment: $segment,
      brand: $brand,
      tag: $tag,
      ids: $ids,
      source: $source,
      only: $only
    )
  }
`;

const segmentFields = `
  _id
  name
  description
  subOf
  color
  conditions
`;

const segments = `
  query segments($contentTypes: [String]!) {
    segments(contentTypes: $contentTypes) {
      ${segmentFields}

      getSubSegments {
        ${segmentFields}
      }
    }
  }
`;

const brands = `
  query brands {
    brands {
      _id
      name
    }
  }
`;

const segmentDetail = `
  query segmentDetail($_id: String) {
    segmentDetail(_id: $_id) {
      ${segmentFields}
      getSubSegments {
        ${segmentFields}
      }
    }
  }
`;

const headSegments = `
  query headSegments {
    segmentsGetHeads {
      ${segmentFields}
      getSubSegments {
        ${segmentFields}
      }
    }
  }
`;

const kindCounts = `
  query kindCounts {
    engageMessageCounts(name: "kind")
  }
`;

const statusCounts = `
  query statusCounts($kind: String) {
    engageMessageCounts(name: "status", kind: $kind)
  }
`;

const tagCounts = `
  query tagCounts($kind: String, $status: String) {
    engageMessageCounts(name: "tag", kind: $kind, status: $status)
  }
`;

const verifiedEmails = `
  query engageVerifiedEmails {
    engageVerifiedEmails
  }
`;

const engageEmailPercentages = `
  query engageEmailPercentages {
    engageEmailPercentages {
      avgBouncePercent
      avgClickPercent
      avgComplaintPercent
      avgDeliveryPercent
      avgOpenPercent
      avgRejectPercent
      avgRenderingFailurePercent
      avgSendPercent
    }
  }
`;

export default {
  engageMessages,
  engageMessagesTotalCount,
  engageMessageDetail,
  engageMessageStats,
  users,
  userDetail,
  segments,
  brands,
  customerCounts,
  segmentDetail,
  headSegments,
  kindCounts,
  statusCounts,
  tagCounts,
  verifiedEmails,
  engageEmailPercentages
};
