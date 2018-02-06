const customersAdd = `
  mutation customersAdd($firstName: String, $lastName: String, $email: String) {
    customersAdd(firstName: $firstName, lastName: $lastName, email: $email) {
      _id
    }
  }
`;

const customersEdit = `
  mutation customersEdit(
    $_id: String!,
    $firstName: String,
    $lastName: String,
    $email: String,
    $phone: String,
    $customFieldsData: JSON
  ) {

    customersEdit(
      _id: $_id,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      phone: $phone,
      customFieldsData: $customFieldsData
    ) {

      firstName
      lastName
      email
      phone
    }
  }
`;

const customersAddCompany = `
  mutation customersAddCompany($_id: String!, $name: String!, $website: String) {
    customersAddCompany(_id: $_id, name: $name, website: $website) {
      _id
    }
  }
`;

const customersEditCompanies = `
  mutation customersEditCompanies($_id: String!, $companyIds: [String]) {
    customersEditCompanies(_id: $_id, companyIds: $companyIds) {
      companies {
        _id
        name
        website
      }
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

export default {
  customersAdd,
  customersEdit,
  customersAddCompany,
  customersEditCompanies,
  customersRemove,
  customersMerge
};
