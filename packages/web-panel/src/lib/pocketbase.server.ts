import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/gen/pocketbase-types';
import config from '@helper/config';
console.log('config', config);
const PB_URL = config.PB_URL;
export const pb = new PocketBase(PB_URL) as TypedPocketBase;
