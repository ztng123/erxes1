export const types = () => `
  type CurrentSchedule {
    contractId: String
    version: String
    payDate: Date
    balance: Float
    payment: Float
    interest: Float
    interestEve: Float
    interestNonce: Float
    total: Float
    createdAt: Date
    untilDay: Float
    donePercent: Float
    remainderTenor: Int
  }

  type RecContract {
    _id: String
    number: String
    startDate: Date
    closeDate: Date
    closeType: String
  }

  type Contract {
    _id: String!
    contractTypeId: String
    number: String
    branchId:String
    classification:String
    status: String
    description: String
    createdBy: String
    createdAt: Date
    marginAmount: Float
    leaseAmount: Float
    feeAmount: Float
    tenor: Float
    unduePercent: Float
    interestRate: Float
    repayment: String
    startDate: Date
    scheduleDays: [Float]
    customerId: String
    customerType: String

    debt: Float
    debtTenor: Float
    debtLimit: Float
    insuranceAmount: Float
    salvageAmount: Float
    salvagePercent: Float
    salvageTenor: Float

    relationExpertId: String
    leasingExpertId: String
    riskExpertId: String
    relationExpert: JSON
    leasingExpert: JSON
    riskExpert: JSON

    contractType: ContractType
    companies: Company
    customers: Customer

    insurances: JSON
    collaterals: JSON
    insurancesData: JSON
    collateralsData: JSON
    currentSchedule: CurrentSchedule

    weekends: [Int]
    useHoliday: Boolean

    closeDate: Date
    closeType: String
    closeDescription: String

    relContractId: String
    relContract: RecContract
    dealId: String
    hasTransaction:Boolean
    nextPaymentDate:Date
    nextPayment:Float
    payedAmountSum:Float
    loanBalanceAmount:Float
  }


  type CollateralsDataResponse {
    collateralsData: [JSON]
  }

  type CloseInfo {
    balance: Float,
    undue: Float,
    interest: Float,
    interestEve: Float,
    interestNonce: Float,
    payment: Float,
    insurance: Float,
    debt: Float,
    total: Float,
  }
  type ContractsListResponse {
    list: [Contract],
    totalCount: Float,
  }
`;

const queryParams = `
  page: Int
  perPage: Int
  ids: [String]
  searchValue: String
  sortField: String
  sortDirection: Int
  contractTypeId: String
  conformityMainType: String
  conformityMainTypeId: String
  conformityRelType: String
  conformityIsRelated: Boolean
  isExpired: String
  repaymentDate: String
  startStartDate:Date
  endStartDate:Date
  startCloseDate:Date
  endCloseDate:Date
  dealId:String
  customerId:String
  leaseAmount: Float
  interestRate: Float
  tenor: Int
  repayment: String
  conformityIsSaved: Boolean
  closeDate: Date
  closeDateType: String
  branchId: String
`;

export const queries = `
  contractsMain(${queryParams}): ContractsListResponse
  contracts(${queryParams}): [Contract]
  contractDetail(_id: String!): Contract
  cpContracts(cpUserType: String cpUserEmail: String cpUserPhone: String): [Contract]
  cpContractDetail(_id: String!): Contract
  closeInfo(contractId: String, date: Date): CloseInfo
`;

const commonFields = `
  contractTypeId: String
  number: String
  branchId:String
  classification:String
  status: String
  description: String
  createdBy: String
  createdAt: Date
  marginAmount: Float
  leaseAmount: Float
  feeAmount: Float
  tenor: Float
  unduePercent: Float
  interestRate: Float
  repayment: String
  startDate: Date
  scheduleDays: [Float]
  insurancesData: JSON
  collateralsData: JSON
  customerId: String
  customerType: String
  debt: Float
  debtTenor: Float
  debtLimit: Float
  salvageAmount: Float
  salvagePercent: Float
  salvageTenor: Float
  relationExpertId: String
  leasingExpertId: String
  riskExpertId: String
  weekends: [Int]
  useHoliday: Boolean
  relContractId: String
  dealId: String
`;

export const mutations = `
  contractsAdd(${commonFields}): Contract
  contractsEdit(_id: String!, ${commonFields}): Contract
  contractsDealEdit(_id: String!, ${commonFields}): Contract
  contractsClose(contractId: String, closeDate: Date, closeType: String, description: String): Contract
  contractsRemove(contractIds: [String]): [String]
  getProductsData(contractId: String): CollateralsDataResponse
`;
