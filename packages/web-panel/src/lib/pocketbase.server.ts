import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/gen/pocketbase-types';
import { getConfig } from './utils/config.server';
// import { PUBLIC_PB_URL as PB_URL } from '$env/static/public';
const { global: config } = getConfig();
console.log('config', config);
const PB_URL = config.PB_URL;
export const pb = new PocketBase(PB_URL) as TypedPocketBase;
