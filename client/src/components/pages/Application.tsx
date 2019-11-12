import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  Fragment,
} from 'react';
import { Stage } from '@inlet/react-pixi';
import {
  Button, Menu, Icon, Badge, 
} from 'antd';
import io from 'socket.io-client';
import moment from 'moment';
import { Grid } from '../old/Grid';
import Icosahedron from '../../assets/svg/icosahedron.svg';
import './style/application.css';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Token } from '../old/Token';
import { Input } from '../generics';
import { AppContext } from '../../hooks/contexts';

// const defaultHost = `${window.location.protocol}//${
//   window.location.hostname === 'localhost'
//     ? `${window.location.hostname}:5000`
//     : `${window.location.hostname}:${process.env.PORT || 8080}`
// }`;
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
  const { history } = useContext<any>(AppContext);
  const { game } = useContext<any>(GameContext);
  const vtContainer = useRef<any>(undefined);

  const [actualGame, setActualGame] = useState<any>({});
  const [gameLoading, setGameLoading] = useState(true);
  console.log('Actual game:', actualGame);

  function closeGame() {
    setActualGame({});
    localStorage.removeItem('gameId');
    history.push('/biblioteca');
  }
  const [drawerMenu, setDrawerMenu] = useState<any>('loading');

  useEffect(() => {
    if (!gameLoading) {
      setDrawerMenu('chat');
    }
  }, [gameLoading]);

  useEffect(() => {
    async function getGame() {
      const gameIdLS = localStorage.getItem('gameId');
      const token = localStorage.getItem('jwt');
      if (game.data) {
        if (gameIdLS !== game.data._id) {
          localStorage.setItem('gameId', game.data._id);
        }
        const newGame = await game.onSync({
          path: `games/${game.data._id}`,
          method: 'GET',
        });
        setActualGame(newGame);
        if (newGame._id) {
          client.emit('connect_session', {
            gameId: newGame._id || gameIdLS,
            token,
          });
          client.emit('create_token', {
            gameId: newGame._id || gameIdLS,
            name: 'teste',
            description: 'testedesc',
          });
        }
      } else if (gameIdLS) {
        const newGame = await game.onSync({
          path: `games/${gameIdLS}`,
          method: 'GET',
        });
        setActualGame(newGame);
        if (newGame._id) {
          client.emit('connect_session', {
            gameId: newGame._id || gameIdLS,
            token,
          });
          client.emit('create_token', {
            gameId: newGame._id || gameIdLS,
            name: 'teste',
            description: 'testedesc',
          });
        }
      } else {
        closeGame();
      }
      setGameLoading(false);
    }
    getGame();
  }, []);

  const [drawer, setDrawer] = useState(true);
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight - 80;

  function toggleDrawer() {
    setDrawer((oldState: any) => !oldState);
  }

  // const onUpdateGame = useCallback(
  //   (newGame: any) => {
  //     setActualGame(newGame);
  //   },
  //   [game, setActualGame],
  // );

  const onUpdateToken = useCallback(
    (tokenList: any) => {
      setActualGame((prevState: any) => ({
        ...prevState,
        tokens: tokenList,
      }));
    },
    [setActualGame],
  );

  const [diceRoll, setDiceRoll] = useState<any>('');

  function rollDice() {
    const newNumber = String(Math.floor(Math.random() * 20) + 1);
    setDiceRoll(newNumber);

    client.emit('dice_roll', {
      gameId: actualGame._id,
      token: localStorage.getItem('jwt'),
      newNumber,
    });
  }

  const onDiceRoll = useCallback(
    (newDice: any) => {
      setDiceRoll(newDice);
    },
    [diceRoll],
  );

  const [msgCounter, setMsgCounter] = useState(0);

  useEffect(() => {
    if (drawerMenu === 'chat') {
      setMsgCounter(0);
    }
  }, [drawerMenu]);

  const onReceiveMsg = useCallback(
    (chatLog: any) => {
      if (drawerMenu !== 'chat') {
        setMsgCounter((prevNumber: any) => prevNumber + 1);
      }
      setActualGame((prevState: any) => ({ ...prevState, chatLog }));
    },
    [setActualGame, drawerMenu],
  );

  function handleDrawerMenuClick(e: any) {
    setDrawerMenu(e.key);
  }

  useEffect(() => {
    client.on('token_update', onUpdateToken);
    // client.on('refresh_game', onUpdateGame);
    client.on('dice_roll', onDiceRoll);
    client.on('receive_msg', onReceiveMsg);
    return () => {
      client.off('dice_roll', onDiceRoll);
      client.off('token_update', onUpdateToken);
      // client.off('refresh_game', onUpdateGame);
      client.off('receive_msg', onReceiveMsg);
    };
  }, [onUpdateToken, onDiceRoll, onReceiveMsg]);

  function onTokenChange(
    _id: any,
    idx: any,
    data: any,
    opt: 'default' | 'state' | 'socket' = 'default',
  ) {
    if (opt === 'default' || opt === 'state') {
      setActualGame(({ tokens, ...prevState }: any) => ({
        ...prevState,
        tokens: [
          ...tokens.slice(0, idx),
          {
            ...tokens[idx],
            tokenSetup: { ...tokens[idx].tokenSetup, ...data },
          },
          ...tokens.slice(idx + 1),
        ],
      }));
    }
    if (opt === 'default' || opt === 'socket') {
      if (opt) {
        client.emit('update_token', {
          gameId: actualGame._id,
          tokenId: _id,
          data,
        }); 
      }
    }
  }

  const [msg, setMsg] = useState('');

  const [msgError, setMsgError] = useState('');

  function sendMsg() {
    if (msg !== '') {
      if (msg === '/r 1d20') {
        rollDice();
      } else {
        client.emit('send_msg', {
          gameId: actualGame._id,
          token: localStorage.getItem('jwt'),
          msg,
        });
        setMsg('');
      }
    } else {
      setMsgError('A mensagem a ser enviada não pode ficar vazia.');
    }
  }

  let drawerBody;
  switch (drawerMenu) {
    case 'chat':
      drawerBody = (
        <Fragment>
          <div className="chat">
            {actualGame.chatLog
              ? actualGame.chatLog.log
                ? actualGame.chatLog.log.map((m: any) => (
                  <div className="msg">
                    <span className="msg-text">{m.msg}</span>
                    <span className="msg-sender">{m.sender.name}</span>
                    <span className="msg-date">
                      {moment(m.date).format('HH:mm')}
                    </span>
                  </div>
                ))
                : undefined
              : undefined}
          </div>
          <div className="chat-text">
            <Input
              type="textarea"
              error={msgError}
              rows={3}
              value={msg}
              onPressEnter={sendMsg}
              onChange={(e: any) => setMsg(e.target.value)}
            />
            <Button type="primary" onClick={sendMsg}>
              Enviar
            </Button>
          </div>
        </Fragment>
      );
      break;
    case 'journal':
      drawerBody = <Fragment>Diário</Fragment>;
      break;
    default:
      drawerBody = 'Loading';
  }
  return (
    <div className={`app-layout ${drawer ? '' : 'hidden'}`}>
      <div className="vt-container" ref={vtContainer}>
        {gameLoading ? (
          'Loading'
        ) : (
          <Stage
            className="app"
            width={stageWidth}
            height={stageHeight}
            options={{ antialias: true, backgroundColor: 0xffffff }}
          >
            <Grid
              x={0}
              y={0}
              cellSize={80}
              parentWidth={stageWidth}
              parentHeight={stageHeight}
            />
            {actualGame.tokens
              && actualGame.tokens.map((token: any, idx: any) => (
                <Token
                  key={token._id}
                  onTokenChange={onTokenChange}
                  tokenProps={{ ...token.tokenSetup, _id: token._id, idx }}
                  parentWidth={stageWidth}
                  parentHeight={stageHeight}
                />
              ))}
          </Stage>
        )}
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
            type="danger"
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
              {msgCounter !== 0 ? (
                <Badge count={msgCounter} overflowCount={10}>
                  <Icon type="message" />
                </Badge>
              ) : (
                <Icon type="message" />
              )}
            </Menu.Item>
            <Menu.Item key="journal">
              <Icon type="book" />
            </Menu.Item>
          </Menu>
        </div>
        {drawerBody}
      </div>
    </div>
  );
};
