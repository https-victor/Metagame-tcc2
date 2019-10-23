export type DynObj = { [k: string]: any };
export type Subtract<T, T1> = Pick<T, Exclude<keyof T, keyof T1>>;

export type RequestParams = {
    path: string;
    method: string;
    headers?: any;
    body?: any;
    host?: any;
    replaceHeaders?: boolean;
  };