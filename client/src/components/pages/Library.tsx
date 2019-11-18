import React, { useContext, Fragment, useState, useEffect } from 'react';
import {
  Button, Icon, Spin, Empty, Menu, 
} from 'antd';
import { useLibrary } from './hooks/useLibrary';
import { GameCard } from '../business/GameCard';
import { Input } from '../generics';
import './style/library.css';
import { GameContext } from '../../hooks/contexts/GameContext';
import { useForm } from '../../hooks/generics/useForm';
import { AppContext } from '../../hooks/contexts';
import { GameForm } from '../forms/GameForm';
import { GameDetails } from '../business/GameDetails';
import { gameValidators, searchValidators } from '../../utils/validators';
import { eventTargetValue } from '../../utils/functions';

export const Library = () => {
  const { games, getGames } = useLibrary();
  const [siderMode, setSiderMode] = useState('');
  const gameForm = useForm(gameValidators, {});
  const searchForm = useForm(searchValidators, {});
  const { onRequest, history, auth } = useContext<any>(AppContext);
  const { game } = useContext<any>(GameContext);

  const { openGame, setGame, loading } = game;

  function closeSider() {
    setSiderMode('');
    gameForm.onReset();
    setGame({});
  }

  useEffect(() => {
    const pathName = window.location.pathname;
    switch(pathName){
      case '/campanhas/meus-jogos':
      case '/campanhas/inscritas':
      case '/campanhas':
        break;
        default:
          
          break;
    }
  }, [])


  function openSider(mode: string, selectedGame?: any) {
    return async () => {
      setSiderMode(mode);
      if (mode === 'edit') {
        gameForm.onSet({ name: game.name, description: game.description });
        gameForm.onReset('errors');
      } else if (mode === 'add') {
        setGame({});
        gameForm.onReset();
      }
      if (mode === 'details') {
        if (selectedGame && selectedGame._id !== game._id) {
          try {
            await game.onSync({
              path: `games/${selectedGame._id}`,
              method: 'GET',
            });
          } catch (err) {
            console.error(err);
            closeSider();
          }
        }
      }
    };
  }

  async function deleteGame() {
    try {
      await onRequest({
        path: `games/${game._id}`,
        method: 'DELETE',
      });
      gameForm.onReset('errors');
      await games.onSync();
      closeSider();
    } catch (err) {
      console.error(err);
    }
  }

  async function addNewGame() {
    try {
      const newGame = await gameForm.onSubmit(
        {
          path: 'games/',
          method: 'POST',
          body: gameForm.values,
        },
        (e: any) => console.log(e),
      );
      if(gameForm.values.picture){
      const jwtFromLS = localStorage.getItem('jwt');
      let formFile = new FormData();
      formFile.append('picture',gameForm.values.picture);
      await fetch(`${window.location.protocol}//${
        window.location.hostname === 'localhost'
          ? `${window.location.hostname}:5000`
          : `${window.location.hostname}`
      }/api/games/upload/${newGame._id}`,{method:'POST', headers:{'x-auth-token':jwtFromLS as any},body: formFile});
      }
      gameForm.onReset('errors');
      await games.onSync();
      closeSider();
    } catch (err) {
      console.error(err);
    }
  }
  async function onUnsubscribe () {
    try {
      await game.onGet({
        path: `games/unsubscribe/${game._id}`,
        method: 'POST',
      });
      closeSider();
      await games.onSync({
        path: `games/?filter=all`,
        method: 'GET',
      });
    } catch (err) {
      console.error(err)
    }
  }
  async function onSubscribe () {
    try {
      await game.onGet({
        path: `games/subscribe/${game._id}`,
        method: 'POST',
      });
      closeSider();
      await games.onSync({
        path: `games/?filter=all`,
        method: 'GET',
      });
    } catch (err) {
      console.error(err)
    }
  }

  async function editGame() {
    try {
      await gameForm.onSubmit(
        {
          path: `games/${game._id}`,
          method: 'PUT',
          body: gameForm.values
        },
        (e: any) => console.log(e)
      );
      if(gameForm.values.picture){
      const jwtFromLS = localStorage.getItem('jwt');
      let formFile = new FormData();
      formFile.append('picture',gameForm.values.picture);
      await fetch(`${window.location.protocol}//${
        window.location.hostname === 'localhost'
          ? `${window.location.hostname}:5000`
          : `${window.location.hostname}`
      }/api/games/upload/${game._id}`,{method:'POST', headers:{'x-auth-token':jwtFromLS as any},body: formFile});
      }
      gameForm.onReset('errors');
      await games.onSync();
      closeSider();
    } catch (err) {
      console.error(err);
    }
  }

  let actions=undefined;
  switch (siderMode) {
    case 'add':
      actions = (
        <Button type='primary' onClick={addNewGame}>
          Adicionar
        </Button>
      );
      break;
    case 'edit':
      actions = (
        <Fragment>
          <Button onClick={openSider('details')}>Cancelar</Button>
          <Button type='primary' onClick={editGame}>
            Editar
          </Button>
        </Fragment>
      );
      break;
    case 'details':
      actions = 
        auth.user._id === game.gmId ? (
          <Fragment>
            <Button
              icon='edit'
              type='primary'
              onClick={openSider('edit')}
            >
              Editar
            </Button>
            <Button icon='delete' type='danger' onClick={deleteGame}>
              Deletar
            </Button>
          </Fragment>
        ) : game.players ? (game.players.filter((player:any)=>player._id===auth.user._id).length>0 ? (<Button icon='api' type='danger' onClick={onUnsubscribe}>
        Desinscrever-se
      </Button>):undefined): (
        undefined
      )
      break;
    default:
      actions = undefined;
      break;
  }
  let siderBody;
  switch (siderMode) {
    case 'details':
      siderBody = loading.state ? (
        <Spin />
      ) : (
        <GameDetails closeSider={closeSider} onSubscribe={onSubscribe} game={game} openGame={openGame} />
      );
      break;
    case 'edit':
    case 'add':
      siderBody = (
        <GameForm
          closeSider={closeSider}
          game={game}
          form={gameForm}
          mode={siderMode}
        />
      );
      break;
    default:
      siderBody = undefined;
      break;
  }

  const [selectedMenu, setSelectedMenu] = useState('recent');

  function handleMenu(e: any) {
    setSelectedMenu(e.key);
  }

  function submitSearch (e:any){
    // return () =>{
      games.onSync({method:'GET',path:`games/?filter=search&name=${searchForm.values.search}`})
    // }
  }
  return (
    <div className="library-page-container">
      <div className="library-wrapper">
        <div className="library-menu">
          <Menu
            mode="vertical"
            onClick={handleMenu}
            selectedKeys={[selectedMenu]}
          >
            <div className="search-menu ant-menu-item custom">
              <Input
                formItemProps={{ className: 'search-box' }}
                value={searchForm.values.search}
                error={searchForm.errors.search}
                onChange={searchForm.onChange('search',eventTargetValue)}
                addonAfter={<Icon onClick={submitSearch} type="search" style={{marginRight: 0}}/>}
                placeholder="Pesquisar"
              />
            </div>
            <Menu.Divider />
            <Menu.Item key="recent" onClick={getGames()}>
              <Icon type="history" />
              <span>Campanhas recentes</span>
            </Menu.Item>
            <Menu.Item key="my-games" onClick={getGames('my')}>
              <Icon type="inbox" />
              <span>Minhas campanhas</span>
            </Menu.Item>
            <Menu.Item key="share-alt" onClick={getGames('subscribed')}>
              <Icon type="link" />
              <span>Campanhas inscritas</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="new-campaign" onClick={openSider('add')}>
              <Icon type="plus" />
              <span>Criar nova campanha</span>
            </Menu.Item>
          </Menu>
        </div>
        <div className="library-content">
          <div
            className={`container ${siderMode ? '' : 'hidden'} ${
              games.loading.state
              || (games.data.length === 0
                && history.location.pathname === '/campanhas/inscritas')
                ? 'center'
                : ''
            }`}
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
                ) : history.location.pathname !== '/campanhas/inscritas' ? (
                  undefined
                ) : (
                  <Empty description="Você não está inscrito em nenhum outro jogo!" />
                )}
              </Fragment>
            ) : (
              <Spin />
            )}
          </div>
          {siderMode ? (
            <div className="library-sider">
              {siderBody}
              <div className="actions-wrapper">{actions}</div>
            </div>
          ) : (
            undefined
          )}
        </div>
      </div>
    </div>
  );
};
