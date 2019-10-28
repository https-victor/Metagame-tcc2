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
        <p>{game.players}</p>
      </div>
    </div>
  );
};
