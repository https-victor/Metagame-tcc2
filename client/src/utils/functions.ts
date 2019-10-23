

import { useState } from 'react';

export const identity = (v: any) => v;
export const eventTargetValue = (e: any) => e.target.value;
export const eventTargetChecked = (e: any) => e.target.checked;

export function useAsyncState<T>(initialValue: any = undefined) {
  const [value, setValue] = useState<T>(initialValue);
  const setter = (x: any) => new Promise((resolve) => {
    setValue(x);
    resolve(x);
  });
  return [value, setter];
}

/**
 * Luiz Fernando - 21/08/2019
 * Essa função irá converter uma requisição para um objeto..
 */
export const reqToJson = async (req: any) => {
  const data = await req.json();
  return data;
};

export function setReducedState(
  state: any,
  retain: Array<string>,
  callback: any,
) {
  const retainedState = retain.reduce(
    (acc: any, item: string) => ({
      ...acc,
      [item]: state[item],
    }),
    {},
  );
  callback(retainedState);
}

export const getRawPhone = (num: string) => typeof num === 'string' ? num.replace(/[\(\)\s_-]/g, '') : num;

export const getPrefixedRoute = (path: string | any) => {
    if (process.env.NODE_ENV === 'development') {
      return path;
    }
    if (typeof path === 'string') {
      return process.env.PUBLIC_URL + path;
    }
    return process.env.PUBLIC_URL + path.pathname;
  };