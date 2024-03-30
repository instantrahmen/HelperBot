import { setContext, getContext, hasContext } from 'svelte';

export const createStore = <T>(
  _startValue: T,
  _context: string,
  subscribe?: (state: T) => void
) => {
  return (startValue = _startValue, context = _context): { state: T } => {
    if (hasContext(context)) {
      return getContext(context);
    }

    let _state = $state(startValue);

    const _store = {
      get state(): T {
        return _state;
      },
      set state(v: T) {
        _state = v;
        if (subscribe) subscribe(v);
      },
    };
    setContext(context, _store);
    return _store;
  };
};
