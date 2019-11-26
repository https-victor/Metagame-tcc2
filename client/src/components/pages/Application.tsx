import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  Fragment,
} from 'react';
import { Stage, Sprite } from '@inlet/react-pixi';
import {
  Button, Menu, Icon, Badge, Avatar, 
} from 'antd';
import io from 'socket.io-client';
import moment from 'moment';
import Dragger from 'antd/lib/upload/Dragger';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Grid } from '../old/Grid';
import Icosahedron from '../../assets/svg/icosahedron.svg';
import './style/application.css';
import { Token } from '../old/Token';
import { Input, Dialog, ButtonProps } from '../generics';
import { AppContext } from '../../hooks/contexts';
import { useDialog } from '../../hooks/generics/useDialog';
import { useForm } from '../../hooks/generics/useForm';
import { tokenFormValidators } from '../../utils/validators';
import { eventTargetValue, getImgSrc } from '../../utils/functions';
import ArcherImg from '../../assets/png/archer.png';

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

export const Application = () => {
  const { history, onRequest } = useContext<any>(AppContext);
  const { game } = useContext<any>(GameContext);
  const vtContainer = useRef<any>(undefined);

  const dialog = useDialog();
  const form = useForm(tokenFormValidators);
  const [selectedToken, setSelectedToken] = useState<any>({});

  const [actualGame, setActualGame] = useState<any>({});
  const [gameLoading, setGameLoading] = useState(true);
  console.log('Actual game:', actualGame);

  function closeGame() {
    setActualGame({});
    localStorage.removeItem('gameId');
    history.push('/campanhas');
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

  const tokenList = actualGame.tokens || [];

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

  console.log(form.values)
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
    client.on('dice_roll', onDiceRoll);
    client.on('receive_msg', onReceiveMsg);
    return () => {
      client.off('dice_roll', onDiceRoll);
      client.off('token_update', onUpdateToken);
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
        client.emit('update_token_setup', {
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

  function onOpenDialog(
    mode: 'addToken' | 'editToken' | 'deleteToken',
    token?: any,
  ) {
    return () => {
      if (mode === 'addToken') {
        form.onReset();
      } else if (mode === 'editToken') {
        form.onSet({
          name: token.name,
          description: token.description,
          hp: token.hp,
          type: token.type,
        });
      }
      setSelectedToken(token);
      dialog.onChange(mode);
    };
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
                  <div className="msg" key={m._id}>
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
      drawerBody = (
        <Fragment>
          <div className="journal">
            {tokenList.map((token: any) => (
              <div key={token._id} className="token-journal">
                <div className="token-info">
                  <Avatar shape="square" icon={`${token.img?undefined:'file-image'}`} src={token.img ? Object.keys(token.img).length > 0 ? getImgSrc(token.img) : undefined : undefined} />
                  <span>{token.name}</span>
                </div>
                <div className="token-actions">
                  <Button
                    shape="circle"
                    size="small"
                    onClick={onOpenDialog('editToken', token)}
                    icon="edit"
                    type="primary"
                    ghost
                  />
                  <Button
                    shape="circle"
                    size="small"
                    onClick={onOpenDialog('deleteToken', token)}
                    icon="delete"
                    type="danger"
                    ghost
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="journal-actions">
            <Button type="primary" onClick={onOpenDialog('addToken')}>
              <Icon type="plus" />
              <span>Adicionar Miniatura</span>
            </Button>
          </div>
        </Fragment>
      );
      break;
    default:
      drawerBody = 'Loading';
  }

  function onCloseDialog() {
    setSelectedToken({});
    form.onReset();
    dialog.onChange('');
  }
  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const [imgUrl, setImgUrl] = useState(undefined);
  function beforeUpload(file: any) {
    getBase64(file, (imageUrl: any) => setImgUrl(imageUrl));
    return true;
  }

  function handleChange(info: any) {
    let newFileList = info.fileList.slice(-1);
    return newFileList[0].originFileObj;
  }

  const renderDialogBody = () => {
    switch (dialog.mode) {
      case 'addToken':
        return (
          <div className='token-form'>
            <Input
              value={form.values.name}
              label='Nome:'
              error={form.errors.nome}
              onChange={form.onChange('name', eventTargetValue)}
            />
            <Input
              value={form.values.description}
              label='Descrição:'
              error={form.errors.description}
              onChange={form.onChange('description', eventTargetValue)}
            />
          </div>
        );
      case 'editToken':
        return (
          <div className='token-form'>
            <Dragger
              // action={`http://localhost:5000/api/games/upload/${game._id}`}
              name='picture'
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={form.onChange('picture', handleChange)}
            >
              <div
                className='div-upload'
                style={{
                  background: `url(${imgUrl ||
                    (selectedToken.img ? (Object.keys(selectedToken.img).length > 0
                      ? selectedToken.img.buffer
                        ? getImgSrc(selectedToken.img)
                        : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1'
                      : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1')
                      : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1')}) no-repeat center/cover`
                }}
              >
                <span>Upload</span>
              </div>
            </Dragger>
            <Input
              value={form.values.name}
              label='Nome:'
              error={form.errors.nome}
              onChange={form.onChange('name', eventTargetValue)}
            />
            <Input
              value={form.values.description}
              label='Descrição:'
              error={form.errors.description}
              onChange={form.onChange('description', eventTargetValue)}
            />
            <Input
              value={form.values.hp}
              label='HP:'
              error={form.errors.hp}
              onChange={form.onChange('hp', eventTargetValue)}
            />
            <Input
              value={form.values.type}
              label='Tipo:'
              error={form.errors.type}
              onChange={form.onChange('type', eventTargetValue)}
            />
          </div>
        );
      default:
        return <div>Tem certeza que deseja deletar o token?</div>;
    }
  };

  async function onSubmit() {
    if (dialog.mode === 'editToken') {
      const formErrors = form.validationErrors();
      if(form.values.picture){
        let formFile = new FormData();
        formFile.append('picture',form.values.picture);
        await fetch(
          `${window.location.protocol}//${
            window.location.hostname === 'localhost'
              ? `${window.location.hostname}:5000`
              : `${window.location.hostname}`
          }/api/tokens/upload/${actualGame._id}/${selectedToken._id}`,
          {
            method: 'POST',
            body: formFile,
          }
        );
      }
      if (Object.keys(formErrors).length < 1) {
        client.emit('update_token', {
          gameId: actualGame._id,
          tokenId: selectedToken._id,
          token: localStorage.getItem('jwt'),
          fields: {
            ...form.values,
          },
        });
        onCloseDialog();
      } else if(form.values.picture){
        client.emit('update_token',undefined)
      } else {
        form.onSet(formErrors, 'errors');
      }
    } else if (dialog.mode === 'addToken') {
      const formErrors = form.validationErrors();
      
      if (Object.keys(formErrors).length < 1) {
        client.emit('create_token', {
          gameId: actualGame._id,
          name: form.values.name,
          description: form.values.description,
        });
        onCloseDialog();
      } else {
        form.onSet(formErrors, 'errors');
      }
    } else {
      client.emit('delete_token', {
        gameId: actualGame._id,
        tokenId: selectedToken._id,
      });
      onCloseDialog();
    }
  }

  const getDialogButtons = (): ButtonProps[] => {
    switch (dialog.mode) {
      case 'addToken':
        return [
          {
            key: 'next',
            type: 'primary',
            children: 'Adicionar',
            onClick: onSubmit,
          },
        ];
      case 'editToken':
        return [
          {
            key: 'next',
            type: 'primary',
            children: 'Editar',
            ghost: true,
            onClick: onSubmit,
          },
        ];
      default:
        return [
          {
            key: 'next',
            type: 'danger',
            children: 'Deletar',
            onClick: onSubmit,
          },
        ];
    }
  };

  let backgroundSprite:any = undefined;
    if (actualGame.img) {
      if (Object.keys(actualGame.img).length > 0) {
        backgroundSprite = (
          <Sprite
            width={stageWidth}
            height={stageHeight}
            anchor={0}
            image={getImgSrc(actualGame.img)}
          />
        );
      }
    };


  return (
    <div className={`app-layout ${drawer ? '' : 'hidden'}`}>
      <div className='vt-container' ref={vtContainer}>
        {gameLoading ? (
          'Loading'
        ) : (
          <Stage
            className='app'
            width={stageWidth}
            height={stageHeight}
            options={{ antialias: true, backgroundColor: 0xffffff }}
          >
            {backgroundSprite}
            <Grid
              x={0}
              y={0}
              cellSize={80}
              parentWidth={stageWidth}
              parentHeight={stageHeight}
            />
            {tokenList.map((token: any, idx: any) => (
              <Token
                key={token._id}
                onTokenChange={onTokenChange}
                tokenProps={{
                  ...token.tokenSetup,
                  _id: token._id,
                  idx,
                  name: token.name,
                  img: token.img
                    ? Object.keys(token.img).length > 0
                      ? getImgSrc(token.img)
                      : ArcherImg
                    : ArcherImg,
                  hp: token.hp,
                }}
                parentWidth={stageWidth}
                parentHeight={stageHeight}
              />
            ))}
          </Stage>
        )}
      </div>
      <div className='app-footer'>
        <div className='dice' onClick={rollDice}>
          <span className={`${diceRoll.length === 2 ? 'double' : ''}`}>
            {diceRoll}
          </span>
          <img
            className='menu-btn'
            width={100}
            src={Icosahedron}
            alt='Icosahedron'
          />
        </div>

        <div className='drawer-btn-container'>
          <Button
            type='danger'
            shape='circle'
            icon='logout'
            onClick={closeGame}
          />
          <Button
            type='primary'
            shape='circle'
            icon={drawer ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleDrawer}
          />
        </div>
      </div>
      <div className='app-drawer'>
        <div className='drawer-header'>
          <Menu
            onClick={handleDrawerMenuClick}
            selectedKeys={[drawerMenu]}
            mode='horizontal'
          >
            <Menu.Item key='chat'>
              {msgCounter !== 0 ? (
                <Badge count={msgCounter} overflowCount={10}>
                  <Icon type='message' />
                </Badge>
              ) : (
                <Icon type='message' />
              )}
            </Menu.Item>
            <Menu.Item key='journal'>
              <Icon type='book' />
            </Menu.Item>
          </Menu>
        </div>
        {drawerBody}
      </div>
      <Dialog
        width='1020px'
        body={renderDialogBody()}
        closable={false}
        actions={getDialogButtons()}
        onClose={onCloseDialog}
        open={dialog.mode}
      />
    </div>
  );
};
