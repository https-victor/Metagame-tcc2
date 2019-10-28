import React, { useContext, Fragment, useState } from 'react';
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
import { GameForm } from '../forms/GameForm';
import { GameDetails } from '../business/GameDetails';
import { gameValidators } from '../../utils/validators';

export const Library = () => {
  const { games, getGames } = useLibrary();
  const [siderMode, setSiderMode] = useState('');
  const gameForm = useForm(gameValidators, {});
  const { onRequest, history } = useContext<any>(AppContext);
  const { game } = useContext<any>(GameContext);

  const { openGame, setGame } = game;
  // openGame(game)
  // trycatch

  function openSider(mode: string, selectedGame?: any) {
    return () => {
      setSiderMode(mode);
      if (mode === 'edit') {
        gameForm.onSet({ name: game.name, description: game.description });
        gameForm.onReset('errors');
      } else if (mode === 'add') {
        setGame({});
        gameForm.onReset();
      }
      if (mode === 'details') {
        if (selectedGame) {
          setGame(selectedGame);
        }
      }
    };
  }

  function closeSider() {
    setSiderMode('');
    gameForm.onReset();
    setGame({});
  }

  async function deleteGame() {
    try {
      await gameForm.onSubmit(
        {
          path: `games/${game._id}`,
          method: 'DELETE',
        },
        (e: any) => console.log(e),
      );
      gameForm.onReset('errors');
      await games.onSync();
      closeSider();
    } catch (err) {
      console.log(err);
    }
  }

  async function addNewGame() {
    try {
      await gameForm.onSubmit(
        {
          path: 'games/',
          method: 'POST',
          body: gameForm.values,
        },
        (e: any) => console.log(e),
      );
      gameForm.onReset('errors');
      await games.onSync();
      closeSider();
    } catch (err) {
      console.log(err);
    }
  }

  async function editGame() {
    try {
      await gameForm.onSubmit(
        {
          path: `games/${game._id}`,
          method: 'PUT',
          body: gameForm.values,
        },
        (e: any) => console.log(e),
      );
      gameForm.onReset('errors');
      await games.onSync();
      closeSider();
    } catch (err) {
      console.log(err);
    }
  }

  let actions;
  switch (siderMode) {
    case 'add':
      actions = (
        <Button type="primary" onClick={addNewGame}>
          Adicionar
        </Button>
      );
      break;
    case 'edit':
      actions = (
        <Fragment>
          <Button onClick={openSider('details')}>Cancelar</Button>
          <Button type="primary" onClick={editGame}>
            Atualizar
          </Button>
        </Fragment>
      );
      break;
    default:
      actions = (
        <Fragment>
          <Button icon="edit" ghost type="primary" onClick={openSider('edit')}>
            Editar
          </Button>
          <Button icon="delete" ghost type="danger" onClick={deleteGame}>
            Deletar
          </Button>
        </Fragment>
      );
      break;
  }
  let siderBody;
  switch (siderMode) {
    case 'details':
      siderBody = <GameDetails game={game} openGame={openGame} />;
      break;
    case 'edit':
    case 'add':
      siderBody = <GameForm game={game} form={gameForm} mode={siderMode} />;
      break;
    default:
      siderBody = undefined;
      break;
  }
  console.log(games.loading.state)
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
      <div className={`library-wrapper ${siderMode ? '' : 'hidden'}`}>
        <div
          className={`container ${games.loading.state || games.data.length === 0 ? 'center' : ''}`}
        >
          {!games.loading.state ? (
            <Fragment>
              {games.data.length !== 0 ? (
                games.data.map((game: any, idx: any) => (
                  <GameCard
                    key={game._id}
                    data={game}
                    tabIndex={idx}
                    ondblclick={openGame(game)}
                    onClick={openSider('details', game)}
                  />
                ))
              ) : history.location.pathname !== '/biblioteca/inscritos' ? (
                undefined
              ) : (
                <Empty description="Você não está inscrito em nenhum outro jogo!" />
              )}
              {history.location.pathname !== '/biblioteca/inscritos' ? (
                <GameCard
                  key="new"
                  className="new"
                  onClick={openSider('add')}
                />
              ) : (
                undefined
              )}
            </Fragment>
          ) : (
          <Spin />)
        }
        </div>
        {siderMode ? (
          <div className="library-sider">
            <Button
              className="close-button"
              shape="circle"
              icon="close"
              type="primary"
              onClick={closeSider}
            />
            {siderBody}
            <div className="actions-wrapper">{actions}</div>
          </div>
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};
