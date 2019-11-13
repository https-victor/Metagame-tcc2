import React, { useContext, useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import Logo from '../../assets/svg/logo.svg';
import { AppContext } from '../../hooks/contexts';
import { Library } from './Library';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Application } from './Application';
import { useRequest } from '../../hooks/providers/useRequest';

export const HomePage = () => {
  const { auth, history, onRequest } = useContext<any>(AppContext);

  const game = useRequest({});
  console.log(game);

  const isOpen = history.location.pathname === '/app';

  function openGame(g: any) {
    return () => {
      game.onSync({ path: `games/${g._id}`, method: 'GET' });
      localStorage.setItem('gameId', g._id);
      history.push('/app');
    };
  }

  function closeGame() {
    game.onSetData({});
    localStorage.removeItem('gameId');
    history.push('/biblioteca');
  }
  console.log(auth.user);
  useEffect(() => {
    async function getGame() {
      const gameId = localStorage.getItem('gameId');
      console.log(gameId);
      if (gameId) {
        try {
          const lastGame = await onRequest({
            path: `games/${gameId}`,
            method: 'GET',
          });
          console.log(lastGame);
          if (isOpen) {
            console.log(isOpen);
            game.onSetData(lastGame);
          }
        } catch (err) {
          console.error(err);
          closeGame();
        }
      } else {
        closeGame();
      }
    }
    getGame();
  }, []);
  return (
    <GameContext.Provider
      value={{
        game: {
          ...game.data,
          isOpen,
          openGame,
          closeGame,
          setGame: game.onSetData,
          onSync: game.onSync,
        },
      }}
    >
      <div className={`page-container ${!isOpen ? 'no-game' : ''}`}>
        {!isOpen ? (
          <div className="page-header">
            <div className="logo-container">
              <img src={Logo} alt="" />
              <p>Metagame</p>
            </div>
            <div className="menu-container">
              <Link to="/biblioteca/recentes" style={{ color: 'white' }}>
                Biblioteca
              </Link>
            </div>
            <div className="actions-container">
              <Link to="/">
                <Button type="default" ghost onClick={auth.onLogout}>
                  Sair
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          undefined
        )}
        <Switch>
          <Route exact path="/" render={(props: any) => 'Home'} />
          <Route path="/biblioteca" component={Library} />
          <Route path="/app" render={() => <Application />} />
        </Switch>
      </div>
    </GameContext.Provider>
  );
};
