import type { AuthModel, RecordAuthResponse } from 'pocketbase';
import type { UsersRecord } from './gen/pocketbase-types';

export type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
export type UserResponse = RecordAuthResponse<UsersRecord>;
export type UserType = UsersRecord & {
  meta: UserResponse['record']['meta'];
};
