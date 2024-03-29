import { redirect } from '@sveltejs/kit';

export function GET({ locals }) {
  locals.pb.authStore.clear();
  redirect(303, '/auth/login');
}
