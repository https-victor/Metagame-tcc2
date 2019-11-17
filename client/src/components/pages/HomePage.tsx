import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import {
  Avatar, Dropdown, Menu, Icon, Button, 
} from 'antd';
import Logo from '../../assets/svg/logo.svg';
import { AppContext } from '../../hooks/contexts';
import { Library } from './Library';
import { GameContext } from '../../hooks/contexts/GameContext';
import { Application } from './Application';
import { useRequest } from '../../hooks/providers/useRequest';
import { getImgSrc } from '../../utils/functions';
import { Community } from './Community';

export const HomePage = () => {
  const { auth, history } = useContext<any>(AppContext);
  const { user, onLogout } = auth;

  const game = useRequest({});

  const isOpen = history.location.pathname === '/play';

  function openGame(g: any) {
    return () => {
      game.onSync({ path: `games/${g._id}`, method: 'GET' });
      localStorage.setItem('gameId', g._id);
      history.push('/play');
    };
  }
  const [selectedMenu, setMenu] = useState('');

  function handleMenu(e: any) {
    setMenu(e.key);
  }
  

  const menu = (
    <Menu>
      <Menu.Item>
        <div className="profile-dropdown">
          <Icon type="user" />
          <span className="username">Meu perfil</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>Opção 1</Menu.Item>
      <Menu.Item>Opção 2</Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Icon type="setting" />
        <span>Configurações</span>
      </Menu.Item>
      <Menu.Item onClick={onLogout}>
        <Icon type="logout" />
        <span>Sair</span>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    switch (window.location.pathname) {
      case '/campanhas':
        setMenu('library');
        break;
        case '/comunidade':
        setMenu('community');
        break;
        case '/ajuda':
        setMenu('help');
        break;
      default:
        setMenu('home');
        break;
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        game: {
          ...game.data,
          isOpen,
          openGame,
          setGame: game.onSetData,
          onSync: game.onSync,
          onGet: game.onGet,
          loading: game.loading,
        },
      }}
    >
      <div className={`page-container ${!isOpen ? 'no-game' : ''}`}>
        {!isOpen ? (
          <div className="page-header">
            <div className="first-part-header">
              <div className="logo-container">
                <img src={Logo} alt="" />
                <p>Metagame</p>
              </div>
              <div className="menu-container">
                <Menu
                  mode="horizontal"
                  onClick={handleMenu}
                  selectedKeys={[selectedMenu]}
                >
                  <Menu.Item key="home">
                    <Link to="/">
                      <Icon type="home" />
                      <span>Início</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="library">
                    <Link to="/campanhas">
                      <Icon type="flag" />
                      <span>Campanhas</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="community">
                    <Link to="/comunidade">
                      <Icon type="global" />
                      <span>Comunidade</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="help" disabled>
                    <Link to="/ajuda">
                      <Icon type="question-circle" />
                      <span>Ajuda</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              </div>
            </div>

            <div className="header-actions">
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="user-profile-action">
                  <Button type="link" size="small" className="username">{user.name}</Button>
                  <Avatar
                    icon={user.img ? undefined : 'user'}
                    src={user.img ? getImgSrc(user.img) : undefined}
                  />
                </div>
              </Dropdown>
            </div>
          </div>
        ) : (
          undefined
        )}
        <Switch>
          <Route exact path="/" render={() => 'Home'} />
          <Route path="/campanhas" component={Library} />
          <Route path="/comunidade" component={Community} />
          <Route path="/ajuda" component={Community} />
          <Route path="/play" render={() => <Application />} />
        </Switch>
      </div>
    </GameContext.Provider>
  );
};
