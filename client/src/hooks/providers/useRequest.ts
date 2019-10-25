import { useState, useContext } from 'react';
import { useLoading, LoadingHook } from './useLoading';
import { AppContext } from '../contexts';
import { RequestParams } from '../../utils/types';
import { identity } from '../../utils/functions';

export type RequestHook = {
  data: any;
  loading: LoadingHook;
  onResetData(): void;
  onSetData(newData: any, formatter?: any): void;
  onGet(endpoint?: RequestParams, formatter?: any): any;
  onSync(endpoint?: RequestParams, formatter?: any): any;
};

export const useRequest = (
  initialState: any = undefined,
  defaultEndpoint: RequestParams | undefined = undefined,
  defaultDataFormatter: any = identity,
): RequestHook => {
  const { onRequest } = useContext<any>(AppContext);
  const [data, setData] = useState<any>(initialState);
  const loading = useLoading();

  function onResetData() {
    setData(initialState);
  }

  function onSetData(newData: any, formatter: any = identity) {
    setData(formatter(newData));
  }

  async function onGet(
    endpoint?: RequestParams,
    formatter?: any,
    filter: any = identity,
  ) {
    loading.onChange(true);
    try {
      const apiData = await onRequest(endpoint || defaultEndpoint); // Erro backend > request por nome do entregador
      const formattedData = formatter
        ? formatter(apiData)
        : defaultDataFormatter(apiData);
      return Promise.resolve(filter(formattedData));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      loading.onChange(false);
    }
  }

  async function onSync(
    endpoint?: RequestParams,
    formatter?: any,
    filter: any = identity,
  ) {
    loading.onChange(true);
    try {
      const apiData = await onRequest(endpoint || defaultEndpoint);
      const formattedData = formatter
        ? formatter(apiData)
        : defaultDataFormatter(apiData);
      setData(filter(formattedData));
      return Promise.resolve(filter(apiData));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      loading.onChange(false);
    }
  }
  return {
    data,
    loading,
    onResetData,
    onSetData,
    onGet,
    onSync,
  };
};
