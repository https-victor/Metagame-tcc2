import { useState, useContext } from 'react';
import { useLoading, LoadingHook } from './useLoading';
import { identity } from '../../utils/functions';
import { AppContext } from '../contexts';

export type RequestHook = {
  data: any;
  loading: LoadingHook;
  onResetData(): void;
  onSetData(newData: any, formatter?: any): void;
  onGet(endpoint: any): any;
  onSync(endpoint: any, formatter?: any): any;
};

export const useRequest = (initialState: any = undefined): RequestHook => {
  const { onRequest } = useContext<any>(AppContext);
  const [data, setData] = useState<any>(initialState);
  const loading = useLoading();

  function onResetData() {
    setData(initialState);
  }

  function onSetData(newData: any, formatter: any = identity) {
    setData(formatter(newData));
  }

  async function onGet(endpoint: any) {
    loading.onChange(true);
    try {
      const apiData = await onRequest(endpoint);
      return Promise.resolve(apiData);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      loading.onChange(false);
    }
  }

  async function onSync(endpoint: any, formatter: any = identity) {
    loading.onChange(true);
    try {
      const apiData = await onRequest(endpoint);
      setData(formatter(apiData));
      return Promise.resolve(apiData);
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
