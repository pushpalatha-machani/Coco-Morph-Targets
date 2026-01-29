import { writable, derived as svelteDerived } from 'svelte/store';

export function state<T>(initial: T) {
  const store = writable(initial);
  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update
  };
}

export function derived<T, U>(stores: any, fn: (values: any) => U) {
  return svelteDerived(stores, fn);
}
