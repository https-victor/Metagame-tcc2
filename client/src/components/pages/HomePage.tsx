import React, { useContext, useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import Logo from '../../assets/svg/logo.svg';
import { AppContext } from '../../hooks/contexts';
import { Library } from './Library';
import { GameContext } from '../../hooks/contexts/GameContext';
import { useForm } from '../../hooks/generics/useForm';
import { Application } from './Application';

export const HomePage = () => {
  const { auth, history } = useContext<any>(AppContext);

  const [game, setGame] = useState({});

  function openGame(game: any) {
    return () => {
      setGame(game);
      history.push('/game');
    };
  }

  return (
    <GameContext.Provider
      value={{
        game,
        openGame,
      }}
    >
      <div className="app-container">
        <div className="page-container">
          <div className="page-header">
            <div className="logo-container">
              <img src={Logo} alt="" />
              <p>Metagame</p>
            </div>
            <div className="menu-container">
              <Link to="/biblioteca/recentes">Biblioteca</Link>
            </div>
            <div className="actions-container">
              <Link to="/">
                <Button type="default" ghost onClick={auth.onLogout}>
                  Sair
                </Button>
              </Link>
            </div>
          </div>
          <Switch>
            <Route exact path="/" render={(props: any) => 'Home'} />
            <Route path="/biblioteca" component={Library} />
            <Route path="/game" render={() => <Application game={game} />} />
          </Switch>
        </div>
      </div>
    </GameContext.Provider>
  );
};
