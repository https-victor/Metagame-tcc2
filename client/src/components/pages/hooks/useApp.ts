import { useEffect } from 'react';
import { notification } from 'antd';
import { RequestParams } from '../../../utils/types';
import { useLoading } from '../../../hooks/providers/useLoading';
import { useAsyncState } from '../../../utils/functions';

export const useApp = (props: any) => {
  const defaultHost = 'http://localhost:3000/api/';
  const globalLoading = useLoading(true);
  const [user, setUser] = useAsyncState({});
  const [isLogged, setIsLogged] = useAsyncState(false);

  function onLogout() {
    globalLoading.onChange(true);
    localStorage.removeItem('jwt');
    props.history.push('/');
    setUser({}).then(() => setIsLogged(false).then(() => globalLoading.onChange(false)));
  }

  const onSetMessage = (
    msg: any,
    type: 'error' | 'success' | 'info' | 'warn' = 'error',
    duration = 5,
    props = {},
  ) => {
    notification[type]({
      message: msg,
      placement: 'bottomRight',
      duration,
      ...props,
    });
  };

  function handleErrorMessages(
    e: any = { message: 'API Error' },
    msg: string = 'A requisição não pode ser realizada pois há erros no formulário!',
  ) {
    if (e.message === 'clienterror') {
      onSetMessage(msg, 'warn');
    } else {
      if (e.message) {
        onSetMessage(e.message, 'error');
      }
      console.error(e);
    }
  }

  async function onRequest(endpoint: RequestParams): Promise<any> {
    const {
      headers: initHeaders,
      body: initBody,
      host: initHost,
      replaceHeaders,
      ...rest
    } = endpoint;
    const host = initHost || defaultHost;

    const jwtFromLS = localStorage.getItem('jwt');
    let header = {};
    header = replaceHeaders !== true && jwtFromLS ? { 'x-auth-token': jwtFromLS } : {};
    header = replaceHeaders !== true
      ? initHeaders
        ? { ...header, ...initHeaders }
        : header
      : initHeaders;
    const body = initBody ? { body: JSON.stringify(initBody) } : {};
    try {
      const response = await fetch(host + endpoint.path, {
        method: endpoint.method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...header,
        },
        ...body,
        ...rest,
      });
      if (response.status >= 200 && response.status < 300) {
        const jwt = response.headers.get('x-auth-token');

        if (jwt !== null) {
          localStorage.setItem('jwt', jwt);
        }
        try {
          const json = response.status === 204
            ? await response.text()
            : await response.json();
          return Promise.resolve(json);
        } catch (e) {
          return Promise.reject(response);
        }
      } else {
        if (response.status === 422) {
          try {
            const json = await response.json();
            return Promise.reject(json);
          } catch (e) {
            onSetMessage('O servidor forneceu uma resposta mal formatada');
            return Promise.reject(e);
          }
        } else {
          switch (response.status) {
            case 401:
              onSetMessage('Faça o login para continuar');
              onLogout();
              return Promise.reject(response.status);
            case 405:
              onSetMessage('Método HTTP não previsto para esta rota');
              break;
            case 200:
              onSetMessage('O servidor forneceu uma resposta mal formatada');
              break;
            case 400:
              return Promise.reject(response);
            default:
              onSetMessage(
                `O servidor forneceu uma resposta não esperada - ${response.status}`,
              );

              console.error(response);
          }
        }
        return Promise.reject(response);
      }
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  }

  async function getUser(token: string) {
    try {
      const res = await onRequest({
        path: 'auth/',
        method: 'GET',
        headers: {
          'x-auth-token': `${token}`,
        },
      });
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async function onLogin(token: any) {
    try {
      globalLoading.onChange(true);
      const userData = await getUser(token);
      setUser({ ...user, ...userData }).then(() => setIsLogged(true));
      localStorage.setItem('jwt', `${token}`);
    } catch (e) {
      setUser({}).then(() => setIsLogged(false));
      console.error(e);
      onSetMessage('Erro ao obter os dados do usuário.');
    } finally {
      globalLoading.onChange(false);
    }
  }

  useEffect(() => {
    async function loginFromJwt() {
      try {
        globalLoading.onChange(true);
        const jwt = localStorage.getItem('jwt') || '';
        const user = await getUser(jwt);
        setUser({ ...user, ...user }).then(() => setIsLogged(true));
      } catch (e) {
        setUser({}).then(() => setIsLogged(false));
      } finally {
        globalLoading.onChange(false);
      }
    }

    if (localStorage.getItem('jwt') !== null) {
      loginFromJwt();
    } else {
      onLogout();
    }
  }, []);

  return {
    auth: {
      isLogged,
      onLogout,
      onLogin,
      user,
    },
    onRequest,
    globalLoading,
    message: {
      handleErrors: handleErrorMessages,
      set: onSetMessage,
    },
  };
};
