import { IUser } from '@erxes/ui/src/auth/types';
import { QueryResponse } from '@erxes/ui/src/types';

export type IGrantRequest = {
  _id?: string;
  cardId: string;
  cardType: string;
  userIds: string[];
  status: string;
  requesterId: string;
  users: { grantResponse: string } & IUser[];
  action: string;
  params: string;
};

export type RequestQueryResponse = {
  grantRequest: IGrantRequest;
} & QueryResponse;
