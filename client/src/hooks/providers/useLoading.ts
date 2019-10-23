import { useState } from 'react';

export type LoadingHook = {
  state: boolean;
  onChange(newState: boolean): void;
  resetState():void;
};

export const useLoading = (initialState = false): LoadingHook => {
  const [state, setState] = useState<boolean>(initialState);

  function resetState() {
    setState(initialState);
  }

  function onChange(newState: boolean) {
    setState(newState);
  }
  return { state, onChange, resetState };
};
