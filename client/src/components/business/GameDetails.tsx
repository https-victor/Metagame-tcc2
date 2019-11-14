import React from 'react';
import { Button, Avatar } from 'antd';
import moment from 'moment';
import { getImgSrc } from '../../utils/functions';

export const GameDetails = ({ closeSider, game, openGame }: any) => (
  <div className="game-wrapper">
    <Button
      className="close-button"
      shape="circle"
      icon="close"
      type="primary"
      onClick={closeSider}
    />
    <div
      className="game-header"
      style={{
        background: `url(${
          Object.keys(game.img).length !== 0
            ? getImgSrc(game.img)
            : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1'
        }) no-repeat center/cover`,
      }}
    >
      <div className="game-overlay">
        <span className="game-name">{game.name}</span>
        <Button className="game-start" type="primary" onClick={openGame(game)}>
          Jogar
        </Button>
      </div>
    </div>
    <div className="description-wrapper">
      <p>{game.description}</p>
    </div>
    <div className="details-wrapper">
      <span>
        <span>GM:</span>
        {game.gm.name}
        <Avatar
          icon={game.gm.img ? undefined : 'user'}
          src={game.gm.img ? getImgSrc(game.gm.img) : undefined}
        />
      </span>
      <span>
        <span>Criado em:</span>
        {moment(game.createdAt).format('DD/MM/YYYY - HH:mm')}
      </span>
    </div>
    <div className="players">
      {game.players.map((player: any) => (
        <div key={player._id}>
          <Avatar
            icon={player.img ? undefined : 'user'}
            src={player.img ? getImgSrc(player.img) : undefined}
          />
          <p>{player.name}</p>
        </div>
      ))}
      <Button>Convidar jogadores</Button>
    </div>
  </div>
);
