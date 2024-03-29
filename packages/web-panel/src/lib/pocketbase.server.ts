import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/gen/pocketbase-types';
import { PUBLIC_PB_URL as PB_URL } from '$env/static/public';



export const pb = new PocketBase(PB_URL) as TypedPocketBase

