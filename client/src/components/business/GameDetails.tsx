import React, { useState, useContext } from 'react';
import { Button, Avatar, Menu, Icon, Spin } from 'antd';
import moment from 'moment';
import { getImgSrc } from '../../utils/functions';
import { Link } from 'react-router-dom';
import { AppContext } from '../../hooks/contexts';

export const GameDetails = ({ closeSider, game, openGame, onSubscribe}: any) => {
  const { auth } = useContext<any>(AppContext);

  const [selectedMenu, setSelectedMenu] = useState('description');
  function handleMenu(e:any){
    setSelectedMenu(e.key);
  }
  
  let gameCTA = <Spin/>;
  if(game.players.filter((player:any)=>player._id===auth.user._id).length>0 || game.gmId === auth.user._id){
    gameCTA = (<Button
      className='game-start'
      type='primary'
      onClick={openGame(game)}
    >
      Jogar
    </Button>);
  }else {
    gameCTA = (<Button
      className='game-start'
      type='primary'
      onClick={onSubscribe}
    >
      Inscrever-se
    </Button>);
  }
  let body;
  switch(selectedMenu){
    case 'details':
      body = (
        <div className='details-wrapper'>
          <div>
            <span>GM:</span>
            <Avatar
              icon={game.gm.img ? undefined : 'user'}
              src={game.gm.img ? getImgSrc(game.gm.img) : undefined}
            />
            {game.gm.name}
          </div>
          <div>
            <span>Criado em:</span>
            {moment(game.createdAt).format('DD/MM/YYYY - HH:mm')}
          </div>
        </div>
      );break;
    case 'players':
      body = (
        <div className="players">
      {game.players.map((player: any) => (
        <div key={player._id} className="player">
          <Avatar
            icon={player.img ? undefined : 'user'}
            src={player.img ? getImgSrc(player.img) : undefined}
          />
          <p>{player.name}</p>
        </div>
      ))}
      {game.gmId===auth.user._id&&
      <Button>Convidar jogadores</Button>}
    </div>
      );break;
      default:
        body = (<div className="description-wrapper">
        <span>Descrição:</span><p>{game.description}</p>
      </div>);break;
  }
  return (
    <div className='game-wrapper'>
      <Button
        className='close-button'
        shape='circle'
        icon='close'
        type='primary'
        onClick={closeSider}
      />
      <div
        className='game-header'
        style={{
          background: `url(${
            Object.keys(game.img).length !== 0
              ? getImgSrc(game.img)
              : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1'
          }) no-repeat center/cover`
        }}
      >
        <div className='game-overlay'>
          <span className='game-name'>{game.name}</span>
          {gameCTA}
        </div>
      </div>
      <div className="sider-body">
        <Menu
          mode='horizontal'
          onClick={handleMenu}
          selectedKeys={[selectedMenu]}
        >
          <Menu.Item key='description'>
            <span>Descrição</span>
          </Menu.Item>
          <Menu.Item key='details'>
            <span>Detalhes</span>
          </Menu.Item>
          <Menu.Item key='players'>
            <span>Jogadores</span>
          </Menu.Item>
        </Menu>
        {body}
      </div>
    </div>
  );};
