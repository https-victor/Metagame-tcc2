import { useState } from 'react';

export const identity = (v: any) => v;
export const eventTargetValue = (e: any) => e.target.value;
export const eventTargetChecked = (e: any) => e.target.checked;
export const getBase64 = (buffer: any) => btoa(new Uint8Array(buffer).reduce(function (data, byte) {
  return data + String.fromCharCode(byte);
}, ''));
export const getImgSrc = (img: any) => `data:${img.contentType};base64,${getBase64(img.buffer.data)}`;
export function useAsyncState<T>(initialValue: any = undefined) {
  const [value, setValue] = useState<T>(initialValue);
  const setter = (x: any) => new Promise((resolve) => {
    setValue(x);
    resolve(x);
  });
  return [value, setter];
}

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
