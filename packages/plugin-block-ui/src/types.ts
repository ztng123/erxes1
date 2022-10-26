import { QueryResponse } from '@erxes/ui/src/types';

export interface IPackageDoc {
  name: string;
  description: string;
  wpId: string;
  level: string;
  projectWpId: string;
  projectId: string;
  price: number;
  duration: number;
  profit: number;
}

export interface IPackage extends IPackageDoc {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IInvestmentDoc {
  erxesCustomerId: string;
  packageId: string;
  amount: number;

  package: IPackage;
}

export interface IInvestment extends IInvestmentDoc {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export type PackagesQueryResponse = {
  packages: IPackage[];
} & QueryResponse;

export type PackageRemoveMutationResponse = {
  packagesRemove: (mutation: { variables: { _id: string } }) => Promise<string>;
};

export type DetailQueryResponse = {
  packageDetail: IPackage;
  loading: boolean;
};

export type InvestmentsQueryResponse = {
  investments: IInvestment[];
  loading: boolean;
  refetch: () => void;
};
