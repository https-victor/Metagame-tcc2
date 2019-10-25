import React, { useContext, Fragment } from 'react';
import {
  Button, Icon, Spin, Empty, 
} from 'antd';
import { Link } from 'react-router-dom';
import { useLibrary } from './hooks/useLibrary';
import { GameCard } from '../business/GameCard';
import { Input } from '../generics';
import './style/library.css';
import { GameContext } from '../../hooks/contexts/GameContext';
import { useForm } from '../../hooks/generics/useForm';
import { AppContext } from '../../hooks/contexts';

export const Library = () => {
  const { games, getGames } = useLibrary();
  const addGameForm = useForm(undefined, {
    name: 'TesteForm',
    description: 'DescriptionForm',
  });
  const { onRequest, history } = useContext<any>(AppContext);
  const { openGame } = useContext<any>(GameContext);

  async function addNewGame() {
    const newGame = await onRequest({
      path: 'games/',
      method: 'POST',
      body: addGameForm.values,
    });
    await games.onSync();
    openGame(newGame);
  }
  return (
    <div className="library-page-container">
      <div className="library-header">
        <Link to="/biblioteca/recentes">
          <Button type="primary" ghost onClick={getGames()}>
            Jogos recentes
          </Button>
        </Link>
        <Button type="primary" ghost onClick={getGames('my')}>
          Meus jogos
        </Button>
        <Button type="primary" ghost onClick={getGames('subscribed')}>
          Jogos inscritos
        </Button>
        <Input suffix={<Icon type="search" />} placeholder="Pesquisar" />
      </div>
      <div className="library-wrapper">
        <div className="container">
          {games.loading.state ? (
            <Spin />
          ) : (
            <Fragment>
              {games.data.length !== 0 ? (
                games.data.map((game: any, idx: any) => (
                  <GameCard
                    key={game._id}
                    data={game}
                    tabIndex={idx}
                    onClick={openGame(game)}
                  />
                ))
              ) : (
                <Empty />
              )}
              {history.location.pathname !== '/biblioteca/inscritos' ? (
                <GameCard key="new" className="new" onClick={addNewGame} />
              ) : (
                undefined
              )}
            </Fragment>
          )}
        </div>
        <div className="library-sider" />
      </div>
    </div>
  );
};
