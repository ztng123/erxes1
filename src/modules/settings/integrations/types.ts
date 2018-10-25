import { IForm } from 'modules/forms/types';
import { IBrand } from '../brands/types';
import { IChannel } from '../channels/types';

export interface IMessengerApp {
  _id: string;
  name: string;
}

export interface ILink {
  twitter?: string;
  facebook?: string;
  youtube?: string;
}

export interface IFacebookApp {
  id: string;
  name: string;
}

export interface IPages {
  id: string;
  name?: string;
  checked?: boolean;
}

export interface IOnlineHour {
  _id: string;
  day: string;
  from: string;
  to: string;
}

export interface IMessagesItem {
  greetings: { title?: string; message?: string };
  away?: string;
  thank?: string;
  welcome?: string;
}

export interface IMessages {
  [key: string]: IMessagesItem;
}

export interface IMessengerData {
  messages?: IMessages;
  notifyCustomer?: boolean;
  supporterIds?: string[];
  availabilityMethod?: string;
  isOnline?: boolean;
  timezone?: string;
  onlineHours?: IOnlineHour[];
  knowledgeBaseTopicId?: string;
  links?: ILink;
}

export interface IUiOptions {
  color?: string;
  wallpaper?: string;
  logo?: string;
  logoPreviewUrl?: string;
}

export interface IFormData {
  loadType?: string;
  successAction?: string;
  fromEmail?: string;
  userEmailTitle?: string;
  userEmailContent?: string;
  adminEmails?: string[];
  adminEmailTitle?: string;
  adminEmailContent?: string;
  thankContent?: string;
  redirectUrl?: string;
}

export interface ITwitterData {
  info?: any;
  token?: string;
  tokenSecret?: string;
}

export interface IFacebookData {
  appId: string;
  pageIds: string[];
}

export interface IIntegration {
  _id: string;
  kind: string;
  name: string;
  brandId?: string;
  description?: string;
  code: string;
  formId: string;
  form: IForm;
  logo: string;
  languageCode?: string;
  createUrl: string;
  createModal: string;
  messengerData?: IMessengerData;
  facebookData?: IFacebookData;
  uiOptions?: IUiOptions;
  formData?: IFormData;
  brand: IBrand;
  channels: IChannel[];
}

// query types
export type IntegrationsQueryResponse = {
  integrations: IIntegration[];
  loading: boolean;
};

type ByBrand = { [key: string]: number };

type IntegrationsCount = {
  byBrand: ByBrand;
};

export type IntegrationsCountQueryResponse = {
  integrationsTotalCount: IntegrationsCount;
  loading: boolean;
};

// mutation types

export type AddIntegrationMutationVariables = {
  formData: IFormData;
  brandId: string;
  name: string;
  languageCode: string;
  formId: string;
};

export type AddIntegrationMutationResponse = {
  addIntegrationMutation: (
    params: {
      variables: AddIntegrationMutationVariables;
    }
  ) => Promise<void>;
};

export type EditIntegrationMutationVariables = {
  _id: string;
  formData: IFormData;
  brandId: string;
  name: string;
  languageCode: string;
  formId: string;
};

export type EditIntegrationMutationResponse = {
  editIntegrationMutation: (
    params: {
      variables: EditIntegrationMutationVariables;
    }
  ) => Promise<void>;
};
