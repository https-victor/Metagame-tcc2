import React, { useContext, useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import Logo from '../../assets/svg/logo.svg';
import { AppContext } from '../../hooks/contexts';
import { Library } from './Library';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Application } from './Application';

export const HomePage = () => {
  const { auth, history, onRequest } = useContext<any>(AppContext);

  const [game, setGame] = useState({});

  const isOpen = history.location.pathname === '/game';

  function openGame(game: any) {
    return () => {
      setGame(game);
      localStorage.setItem('gameId', JSON.stringify(game._id));
      history.push('/game');
    };
  }

  function closeGame() {
    setGame({});
    localStorage.removeItem('gameId');
    history.push('/biblioteca');
  }

  useEffect(() => {
    async function getGame() {
      const gameId = localStorage.getItem('gameId');
      if (gameId) {
        try {
          const lastGame = await onRequest({
            path: `games/${JSON.parse(gameId)}`,
            method: 'GET',
          });
          if (isOpen) {
            setGame(lastGame);
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
          ...game,
          isOpen,
          openGame,
          closeGame,
          setGame,
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
              <Link to="/biblioteca/recentes" style={{color:'white'}}>Biblioteca</Link>
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
          <Route path="/game" render={() => <Application />} />
        </Switch>
      </div>
    </GameContext.Provider>
  );
};
