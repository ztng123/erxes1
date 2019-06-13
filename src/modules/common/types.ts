export interface IRouterProps {
  history: any;
  location: any;
  match: any;
}

export interface IAttachment {
  name: string;
  type: string;
  url: string;
}

export type IAttachmentPreview = {
  name: string;
  type: string;
  data: string;
} | null;

export interface IBreadCrumbItem {
  title: string;
  link?: string;
}

export interface ISubMenuItem {
  title: string;
  link?: string;
}

export interface IQueryParams {
  [key: string]: string;
}

export interface ISelectedOption {
  label: string;
  value: string;
}

export interface IConditionsRule {
  _id: string;
  kind?: string;
  text: string;
  condition: string;
  value: string;
}

export type IDateColumn = {
  month: number;
  year: number;
};

export interface IFormProps {
  errors: any;
  values: any;
  registerChild: (child: React.ReactNode) => void;
  runValidations?: (callback: any) => void;
  isSubmitted: boolean;
}

export type IOption = {
  label: string;
  value: string;
  avatar?: string;
};

export type IButtonMutateProps = {
  name: string;
  values: any;
  isSubmitted: boolean;
  callback?: () => void;
  object?: any;
};
