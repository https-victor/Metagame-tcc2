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
        case 'my':
          history.push('/campanhas/meus-jogos');
          break;
        case 'subscribed':
          history.push('/campanhas/inscritas');
          break;
        default:
          history.push('/campanhas');
          break;
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
