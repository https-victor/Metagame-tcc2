import { useEffect, useContext } from 'react';
import { useRequest } from '../../../hooks/providers/useRequest';
import { AppContext } from '../../../hooks/contexts';

export const useLibrary = () => {
  const { history } = useContext<any>(AppContext);
  const games = useRequest([], { path: 'games/all', method: 'GET' });

  function getGames(path: 'all' | 'recent' | 'my' | 'subscribed' = 'all') {
    return () => {
      let endpoint = null;
      switch (path) {
        case 'recent':
          endpoint = { path: 'games/all', method: 'GET' };
          history.push('/biblioteca/recentes');
          break;
        case 'my':
          endpoint = { path: 'games/my', method: 'GET' };
          history.push('/biblioteca/meus-jogos');
          break;
        case 'subscribed':
          endpoint = { path: 'games/subscribed', method: 'GET' };
          history.push('/biblioteca/inscritos');
          break;
        default:
          endpoint = { path: 'games/all', method: 'GET' };
          history.push('/biblioteca/');
      }
      games.onSync(endpoint);
    };
  }

  useEffect(() => {
    games.onSync();
  }, []);
  return {
    games,
    getGames,
  };
};
