import React from 'react';
import { Button } from 'antd';

export const GameDetails = ({ game, openGame }: any) => {
  console.log(game);
  return (
    <div className="game-wrapper">
      <div className="game-header">
        <Button type="primary" onClick={openGame(game)}>
          Jogar
        </Button>
        <span>{game.name}</span>
      </div>
      <div className="description-wrapper">
        <p>{game.description}</p>
      </div>
      <div className="details-wrapper">
        <span>
          <span>GM:</span>
          {game.gmId}
        </span>
        <span>
          <span>Criado em:</span>
          {game.createdAt}
        </span>
      </div>
      <div className="players">
        {game.players.map((player: any) => (
          <div key={player._id}>
            <p>
              {player.name}
            </p>
            <p>
              {player.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
