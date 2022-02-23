import {
  AddMutationResponse as AddMutationResponseC,
  CustomersQueryResponse as CustomersQueryResponseC,
  ICustomer as ICustomerC,
  ICustomerDoc as ICustomerDocC,
  ICustomerLinks as ICustomerLinksC,
  IUrlVisits as IUrlVisitsC,
  IVisitorContact as IVisitorContactC
} from '@erxes/ui/src/customers/types';

import { IIntegration } from '@erxes/ui-settings/src/integrations/types';

export type IVisitorContact = IVisitorContactC;

export type ICustomerLinks = ICustomerLinksC;

export type ICustomerDoc = ICustomerDocC;

export type IUrlVisits = IUrlVisitsC;

export interface ICustomer extends ICustomerC {
  integration?: IIntegration;
}

// mutation types
export type AddMutationResponse = AddMutationResponseC;

// query types
export type CustomersQueryResponse = CustomersQueryResponseC;
