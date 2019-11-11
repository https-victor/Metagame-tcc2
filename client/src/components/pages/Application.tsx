import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { Stage } from '@inlet/react-pixi';
import { Button } from 'antd';
import io from 'socket.io-client';
import { Grid } from '../old/Grid';
import Icosahedron from '../../assets/svg/icosahedron.svg';
import './style/application.css';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Token } from '../old/Token';

const defaultHost = `${window.location.protocol}//${
  window.location.hostname === 'localhost'
    ? `${window.location.hostname}:4000`
    : `${window.location.hostname}:${process.env.PORT || 4000}`
}`;
console.log(process.env.PORT, window.location.port);
const client = io(defaultHost);
// import { useRequest } from '../../hooks/providers/useRequest';
// import { AppContext } from '../../hooks/contexts';

export type TokenProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
};

export const initialTokenProps = {
  x: 40,
  y: 40,
  width: 80,
  height: 80,
  alpha: 1,
};

export const Application = () => {
  // const { onRequest } = useContext<any>(AppContext);
  const { game } = useContext<any>(GameContext);
  const vtContainer = useRef<any>(undefined);
  const { closeGame } = game;
  // console.log('Actual game:', game);

  useEffect(() => {
    const gameIdLS = localStorage.getItem('gameId');
    if (gameIdLS) {
      client.emit('connect_session', game._id || gameIdLS);
      client.emit('create_token', {
        gameId: game._id || gameIdLS,
        name: 'teste',
        description: 'testedesc',
      });
    }
  }, []);

  const [drawer, setDrawer] = useState(false);
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight - 80;

  function toggleDrawer() {
    setDrawer((oldState: any) => !oldState);
  }

  const [tokens, setTokens] = useState<any>([]);

  const onUpdateGame = useCallback(
    (newGame: any) => {
      game.setGame(newGame);
      console.log(newGame,newGame.tokens)
      setTokens(newGame.tokens);
    },
    [game],
  );

  const onUpdateToken = useCallback(
    (tokenList: any) => {
      setTokens(tokenList);
    },
    [setTokens],
  );

  useEffect(() => {
    client.on('token_update', onUpdateToken);
    client.on('refresh_game', onUpdateGame);
    return () => {
      client.off('token_update', onUpdateToken);
      client.off('refresh_game', onUpdateGame);
    };
  }, [onUpdateToken, onUpdateGame]);

  function onTokenChange(_id: any, data: any, opt: boolean = true) {
    console.log(data);
    setTokens((prevTokens: any) => [
      ...prevTokens.filter((t: any) => t._id !== _id),
      { ...prevTokens.filter((t: any) => t._id === _id), ...data },
    ]);
    if (opt) client.emit('update_token', { gameId: game._id, tokenId: _id, data });
  }

  return (
    <div className={`app-layout ${drawer ? '' : 'hidden'}`}>
      <div className="vt-container" ref={vtContainer}>
        <Stage
          className="app"
          width={stageWidth}
          height={stageHeight}
          options={{ backgroundColor: 0xffffff }}
        >
          <Grid
            x={0}
            y={0}
            cellSize={80}
            parentWidth={stageWidth}
            parentHeight={stageHeight}
          />
          {tokens
            && tokens.map((token: any) => (
              <Token
                key={token._id}
                onTokenChange={onTokenChange}
                tokenProps={{ ...token.tokenSetup, _id: token._id }}
                parentWidth={stageWidth}
                parentHeight={stageHeight}
              />
            ))}
        </Stage>
      </div>
      <div className="app-footer">
        <img
          className="menu-btn"
          width={100}
          src={Icosahedron}
          alt="Icosahedron"
        />
        <div className="drawer-btn-container">
          <Button
            type="primary"
            shape="circle"
            icon="logout"
            onClick={closeGame}
          />
          <Button
            type="primary"
            shape="circle"
            icon={drawer ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleDrawer}
          />
        </div>
      </div>
      <div className="app-drawer" />
    </div>
  );
};
