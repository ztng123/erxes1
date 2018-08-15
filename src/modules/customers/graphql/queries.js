const basicFields = `
  _id
  firstName
  lastName
  avatar

  primaryEmail
  emails
  primaryPhone
  phones

  isUser
  visitorContactInfo

  position
  department
  leadStatus
  lifecycleState
  hasAuthority
  description
  doNotDisturb
  links {
    linkedIn
    twitter
    facebook
    github
    youtube
    website
  }
  ownerId
  owner {
    _id
    details {
      fullName
    }
  }
`;

const customerFields = `
  ${basicFields}
  integrationId
  createdAt
  remoteAddress
  location

  customFieldsData
  messengerData
  twitterData
  facebookData

  tagIds
  getTags {
    _id
    name
    colorCode
  }
`;

const listParamsDef = `
  $page: Int,
  $perPage: Int,
  $segment: String,
  $tag: String,
  $ids: [String],
  $searchValue: String,
  $brand: String,
  $integration: String,
  $form: String,
  $startDate: String,
  $endDate: String,
  $leadStatus: String,
  $lifecycleState: String,
  $sortField: String,
  $sortDirection: Int
`;

const listParamsValue = `
  page: $page,
  perPage: $perPage,
  segment: $segment,
  tag: $tag,
  ids: $ids,
  searchValue: $searchValue,
  brand: $brand,
  integration: $integration
  form: $form,
  startDate: $startDate,
  endDate: $endDate,
  leadStatus: $leadStatus,
  lifecycleState: $lifecycleState,
  sortField: $sortField,
  sortDirection: $sortDirection
`;

const customers = `
  query customers(${listParamsDef}) {
    customers(${listParamsValue}) {
      ${customerFields}
    }
  }
`;

const customersMain = `
  query customersMain(${listParamsDef}) {
    customersMain(${listParamsValue}) {
      list {
        ${customerFields}
      }

      totalCount
    }
  }
`;

const customersExport = `
  query customersExport(${listParamsDef}) {
    customersExport(${listParamsValue})
  }
`;

const customerCounts = `
  query customerCounts(${listParamsDef}, $byFakeSegment: JSON) {
    customerCounts(${listParamsValue}, byFakeSegment: $byFakeSegment)
  }
`;

const customerDetail = `
  query customerDetail($_id: String!) {
    customerDetail(_id: $_id) {
      ${customerFields}
      integration {
        kind
        name
      }
      getMessengerCustomData
      companies {
        _id
        primaryName
        website
      }
      conversations {
        _id
        content
        createdAt
        assignedUser {
          _id
          details {
            avatar
          }
        }
        integration {
          _id
          kind
          brandId,
          brand {
            _id
            name
          }
          channels {
            _id
            name
          }
        }
        customer {
          _id
          firstName
          lastName
          primaryEmail
          primaryPhone
        }
        tags {
          _id
          name
          colorCode
        }
        readUserIds
      }
    }
  }
`;

const customersListConfig = `
  query {
    fieldsDefaultColumnsConfig(contentType: "customer") {
      name
      label
      order
    }
  }
`;

const activityLogsCustomer = `
  query activityLogsCustomer($_id: String!) {
    activityLogsCustomer(_id: $_id) {
      date {
        year
        month
      }
      list {
        id
        action
        content
        createdAt
        by {
          _id
          type
          details {
            avatar
            fullName
          }
        }
      }
    }
  }
`;

export default {
  basicFields,
  customers,
  customersMain,
  customerCounts,
  customerDetail,
  customersListConfig,
  activityLogsCustomer,
  customersExport
};
