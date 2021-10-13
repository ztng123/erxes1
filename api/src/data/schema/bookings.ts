export const types = `
  input BookingStylesInput {
    itemShape: String
    widgetColor: String
    productAvailable: String
    productUnavailable: String
    productSelected: String

    textAvailable: String
    textUnavailable: String
    textSelected: String
  }

  input DisplayBlockInput {
    shape: String
    columns: String
    rows: String
    margin: String
  }

  type DisplayBlockType {
    shape: String
    columns: String
    rows: String
    margin: String
  }

  type BookingStylesType {
    itemShape: String
    widgetColor: String

    productAvailable: String
    productUnavailable: String
    productSelected: String

    textAvailable: String
    textUnavailable: String
    textSelected: String
  }
  
  type CategoryTree {
    _id: String!
    name: String
    parentId: String
    type: String
  }

  type Booking {
    _id: String!
    name: String
    image: Attachment
 
    description: String
    userFilters: [String]
    productCategoryId: String

    styles: BookingStylesType
    displayBlock: DisplayBlockType

    title: String
    brandId: String
    channelIds: [String]
    languageCode: String
    formId: String

    createdDate: Date
    viewCount: Int
    brand: Brand

    createdBy: String
    createdUser: User

    tagIds: [String]
    tags: [Tag]

    childCategories: [ProductCategory]

    categoryTree: [CategoryTree]
    mainProductCategory: ProductCategory

    form: Form

    isActive: Boolean
    leadData: JSON
  }

  type bookingsTotalCount {
    total: Int
    byTag: JSON
    byChannel: JSON
    byBrand: JSON
    byStatus: JSON
  }

  input BookingLeadData {
    successAction: String
    fromEmail: String,
    userEmailTitle: String
    userEmailContent: String
    adminEmails: [String]
    adminEmailTitle: String
    adminEmailContent: String
    thankTitle: String
    thankContent: String
    redirectUrl: String
    themeColor: String
    isRequireOnce: Boolean
    templateId: String
    attachments: [AttachmentInput]
  }
`;

const queryParams = `
  page: Int
  perPage: Int
  brandId: String
  tagId: String
  status: String
`;

export const queries = `
  bookingDetail(_id: String!): Booking
  bookings(${queryParams}): [Booking]
  bookingsTotalCount(channelId: String, brandId: String, tagId: String, searchValue: String, status: String): bookingsTotalCount
`;

const bookingMutationParams = `
  name: String
  image: AttachmentInput
  description: String
  userFilters: [String]
  productCategoryId: String

  styles: BookingStylesInput

  title: String
  brandId: String
  channelIds: [String]
  languageCode: String
  formId: String
  tagIds: [String]

  displayBlock: DisplayBlockInput

  leadData: BookingLeadData
`;

export const mutations = `
  bookingsAdd(${bookingMutationParams}): Booking
  bookingsEdit(_id: String!, ${bookingMutationParams}): Booking
  bookingsRemove(_id: String!): JSON
  bookingsArchive(_id: String! status: Boolean!): Booking
`;
