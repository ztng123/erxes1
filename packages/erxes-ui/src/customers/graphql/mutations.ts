import { customerFields } from './queries';

const commonFields = `
  $avatar: String,
  $firstName: String,
  $lastName: String,
  $middleName: String,
  $sex: Int,
  $birthDate:Date,
  $primaryEmail: String,
  $primaryPhone: String,
  $phones: [String],
  $emails: [String],
  $ownerId: String,
  $position: String,
  $department: String,
  $leadStatus: String,
  $hasAuthority: String,
  $description: String,
  $isSubscribed: String,
  $links: JSON,
  $customFieldsData: JSON,
  $code: String
  $emailValidationStatus: String
  $phoneValidationStatus: String
`;

const commonVariables = `
  avatar: $avatar,
  firstName: $firstName,
  lastName: $lastName,
  middleName: $middleName,
  sex: $sex,
  birthDate: $birthDate,
  primaryEmail: $primaryEmail,
  primaryPhone: $primaryPhone,
  phones: $phones,
  emails: $emails,
  ownerId: $ownerId,
  position: $position,
  department: $department,
  leadStatus: $leadStatus,
  hasAuthority: $hasAuthority,
  description: $description,
  isSubscribed: $isSubscribed,
  links: $links,
  customFieldsData: $customFieldsData,
  code: $code,
  emailValidationStatus: $emailValidationStatus,
  phoneValidationStatus: $phoneValidationStatus,
`;

const customersAdd = `
  mutation customersAdd($state: String, ${commonFields}) {
    customersAdd(state: $state, ${commonVariables}) {
      ${customerFields}
    }
  }
`;

const customersEdit = `
  mutation customersEdit($_id: String!, ${commonFields}) {
    customersEdit(_id: $_id, ${commonVariables}) {
      ${customerFields}
    }
  }
`;

const customersRemove = `
  mutation customersRemove($customerIds: [String]) {
    customersRemove(customerIds: $customerIds)
  }
`;

const customersMerge = `
  mutation customersMerge($customerIds: [String], $customerFields: JSON) {
    customersMerge(customerIds: $customerIds, customerFields: $customerFields) {
      _id
    }
  }
`;

const customersChangeState = `
  mutation customersChangeState($_id: String!, $value: String!) {
    customersChangeState(_id: $_id, value: $value) {
      _id
    }
  }
`;

export default {
  customersAdd,
  customersEdit,
  customersRemove,
  customersMerge,
  customersChangeState
};
