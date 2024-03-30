// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      pb: import('./lib/types/gen/pocketbase-types').TypedPocketBase;
      user?: import('./lib/types/gen/pocketbase-types').UsersResponse;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
