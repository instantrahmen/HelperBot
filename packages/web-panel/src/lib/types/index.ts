import type { AuthModel, RecordAuthResponse } from 'pocketbase';
import type { UsersRecord } from './gen/pocketbase-types';
import type { APIUser } from 'discord-api-types/v10';

export type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
export type UserResponse = RecordAuthResponse<UsersRecord>;

export interface Meta {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken: string;
  expiry: string;
  rawUser: APIUser;
  isNew: boolean;
}

export type UserType = UserResponse & {
  meta: Meta;
};
