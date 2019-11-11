import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { Stage } from '@inlet/react-pixi';
import { Button, Menu, Icon } from 'antd';
import io from 'socket.io-client';
import { Grid } from '../old/Grid';
import Icosahedron from '../../assets/svg/icosahedron.svg';
import './style/application.css';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Token } from '../old/Token';

// const defaultHost = `${window.location.protocol}//${
//   window.location.hostname === 'localhost'
//     ? `${window.location.hostname}:5000`
//     : `${window.location.hostname}:${process.env.PORT || 8080}`
// }`;
console.log(process.env.PORT, window.location.port);
const client = io(
  window.location.hostname === 'localhost'
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : '',
);
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
  console.log('Actual game:', game);

  useEffect(() => {
    const gameIdLS = localStorage.getItem('gameId');
    console.log('DidMount', gameIdLS);
    if (game.name) {
      if (gameIdLS !== game._id) {
        localStorage.setItem('gameId', game._id);
      }
      game.onSync({
        path: `games/${game._id}`,
        method: 'GET',
      });
      if (game._id) {
        client.emit('connect_session', game._id || gameIdLS);
        client.emit('create_token', {
          gameId: game._id || gameIdLS,
          name: 'teste',
          description: 'testedesc',
        });
      }
    }
  }, []);

  const [drawer, setDrawer] = useState(false);
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight - 80;

  function toggleDrawer() {
    setDrawer((oldState: any) => !oldState);
  }

  const [tokens, setTokens] = useState<any>(game.tokens || []);

  const [drawerMenu, setDrawerMenu] = useState<any>('chat');

  const onUpdateGame = useCallback(
    (newGame: any) => {
      game.setGame(newGame);
      console.log(newGame, newGame.tokens);
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

  const [diceRoll, setDiceRoll] = useState<any>('');

  function rollDice() {
    const newNumber = String(Math.floor(Math.random() * 20) + 1);
    setDiceRoll(newNumber);
    client.emit('dice_roll', { gameId: game._id, newNumber });
  }

  const onDiceRoll = useCallback(
    (newDice: any) => {
      setDiceRoll(newDice);
    },
    [diceRoll],
  );

  function handleDrawerMenuClick(e: any) {
    setDrawerMenu(e.key);
  }

  useEffect(() => {
    client.on('token_update', onUpdateToken);
    client.on('refresh_game', onUpdateGame);
    client.on('dice_roll', onDiceRoll);
    return () => {
      client.off('dice_roll', onDiceRoll);
      client.off('token_update', onUpdateToken);
      client.off('refresh_game', onUpdateGame);
    };
  }, [onUpdateToken, onUpdateGame, onDiceRoll]);

  console.log(tokens);
  function onTokenChange(
    _id: any,
    data: any,
    opt: 'default' | 'state' | 'socket' = 'default',
  ) {
    console.log(data);
    if (opt === 'default' || opt === 'state') {
      setTokens((prevTokens: any) => [
        ...prevTokens.filter((t: any) => t._id !== _id),
        { ...prevTokens.filter((t: any) => t._id === _id), ...data },
      ]);
    }
    if (opt === 'default' || opt === 'socket') {
      if (opt) client.emit('update_token', { gameId: game._id, tokenId: _id, data });
    }
  }

  console.log(diceRoll);

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
        <div className="dice" onClick={rollDice}>
          <span className={`${diceRoll.length === 2 ? 'double' : ''}`}>
            {diceRoll}
          </span>
          <img
            className="menu-btn"
            width={100}
            src={Icosahedron}
            alt="Icosahedron"
          />
        </div>

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
      <div className="app-drawer">
        <div className="drawer-header">
          <Menu
            onClick={handleDrawerMenuClick}
            selectedKeys={[drawerMenu]}
            mode="horizontal"
          >
            <Menu.Item key="chat">
              <Icon type="message" />
            </Menu.Item>
            <Menu.Item key="journal">
              <Icon type="book" />
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};
