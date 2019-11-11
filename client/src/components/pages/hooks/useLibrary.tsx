import { useEffect, useContext } from 'react';
import { useRequest } from '../../../hooks/providers/useRequest';
import { AppContext } from '../../../hooks/contexts';

export const useLibrary = () => {
  const { history } = useContext<any>(AppContext);
  const games = useRequest([], { path: 'games?filter=all', method: 'GET' });

  function getGames(path: 'all' | 'recent' | 'my' | 'subscribed' = 'all') {
    return () => {
      let endpoint = null;
      endpoint = { path: `games/?filter=${path}`, method: 'GET' };
      switch (path) {
        case 'recent':
          history.push('/biblioteca/recentes');
          break;
        case 'my':
          history.push('/biblioteca/meus-jogos');
          break;
        case 'subscribed':
          history.push('/biblioteca/inscritos');
          break;
        default:
          history.push('/biblioteca/');
      }
      games.onSync(endpoint);
    };
  }
  console.log(games);
  useEffect(() => {
    games.onSync();
  }, []);
  return {
    games,
    getGames,
  };
};
