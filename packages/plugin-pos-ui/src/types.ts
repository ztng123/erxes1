import { IProductCategory, IProduct } from '@erxes/ui-products/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
import { IBrand } from '@erxes/ui/src/brands/types';

export type IConfigsMap = { [key: string]: any };

export type CatProd = {
  _id: string;
  categoryId: string;
  productId: string;
};

export type IProductGroup = {
  _id: string;
  name: string;
  description: string;
  categoryIds: string[];
  excludedCategoryIds: string[];
  excludedProductIds: string[];
  categories?: IProductCategory[];
  excludedCategories?: IProductCategory[];
  excludedProducts?: IProduct[];
};

export type IScreenConfig = {
  isActive: boolean;
  type: string;
  value: number;
  contentUrl?: string;
};

export type IPos = {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  productDetails?: string[];
  adminIds: [string];
  cashierIds: [string];
  user: IUser;
  isOnline: boolean;
  branchId?: string;
  allowBranchIds?: string[];
  beginNumber?: string;
  maxSkipNumber?: number;
  waitingScreen?: IScreenConfig;
  kioskMachine?: IScreenConfig;
  kitchenScreen?: IScreenConfig;
  uiOptions?: any;
  ebarimtConfig: any;
  erkhetConfig: any;
  catProdMappings?: CatProd[];
  initialCategoryIds?: string[];
  kioskExcludeProductIds?: string[];
  deliveryConfig?: any;
};
export type ISlotGroup = {
  _id: string;
  code: string;
  name: string;
};

// query types
export type PosListQueryResponse = {
  posList: IPos[];
  loading: boolean;
  refetch: () => void;
};

export type GroupsQueryResponse = {
  productGroups: IProductGroup[];
  loading: boolean;
  refetch: () => void;
};

// mutation types
export type PosRemoveMutationResponse = {
  removePos: (mutation: { variables: { _id: string } }) => Promise<any>;
};

export interface IRouterProps {
  history: any;
  location: any;
  match: any;
}

export type Counts = {
  [key: string]: number;
};

export type QueryResponse = {
  loading: boolean;
  refetch: () => void;
  error?: string;
};

export type BrandsQueryResponse = {
  brands: IBrand[];
} & QueryResponse;

export type PosDetailQueryResponse = {
  posDetail: IPos;
} & QueryResponse;

export type IntegrationMutationVariables = {
  name: string;
  description: string;
  productDetails: string[];
};

export type AddPosMutationResponse = {
  addPosMutation: (params: {
    variables: IntegrationMutationVariables;
  }) => Promise<any>;
};

export type EditPosMutationResponse = {
  editPosMutation: (params: {
    variables: { _id: string } & IntegrationMutationVariables;
  }) => Promise<any>;
};

export type RemoveMutationResponse = {
  removeMutation: (params: { variables: { _id } }) => Promise<any>;
};

export type CopyMutationResponse = {
  copyMutation: (params: { variables: { _id: string } }) => Promise<void>;
};

export type IButtonMutateProps = {
  name?: string;
  values: any;
  isSubmitted: boolean;
  confirmationUpdate?: boolean;
  callback?: () => void;
  resetSubmit?: () => void;
  size?: string;
  object?: any;
  text?: string;
  icon?: string;
  type?: string;
  disableLoading?: boolean;
};

export type ProductCategoriesQueryResponse = {
  productCategories: IProductCategory[];
} & QueryResponse;

export type GroupsBulkInsertMutationResponse = {
  productGroupsBulkInsertMutation: (params: {
    variables: {
      posId: string;
      groups: IProductGroup[];
    };
  }) => Promise<void>;
};

export interface IProductShema {
  [key: string]: any;
}

export type SchemaLabelsQueryResponse = {
  getDbSchemaLabels: IProductShema[];
} & QueryResponse;

export type BranchesQueryResponse = {
  branches: any[];
} & QueryResponse;

export interface IOrdersSummary {
  cardAmount: number;
  cashAmount: number;
  mobileAmount: number;
  totalAmount: number;
  finalAmount: number;
  count: number;
}
