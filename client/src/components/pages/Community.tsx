import React, { useContext, useState, useEffect } from 'react';
import { Button, Icon, Menu } from 'antd';
import { Input } from '../generics';
import './style/community.css';
import { AppContext } from '../../hooks/contexts';
import { MyProfile } from './MyProfile';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

export const Community = () => {
  const [siderMode, setSiderMode] = useState<boolean>(true);
  //   const gameForm = useForm(gameValidators, {});
  const { onRequest, history } = useContext<any>(AppContext);

  const [selectedMenu, setSelectedMenu] = useState('');

  function handleMenu(e: any) {
    setSelectedMenu(e.key);
  }
  useEffect(() => {
    switch (window.location.pathname) {
      case '/comunidade':
        setSelectedMenu('feed');
        break;
      case '/comunidade/usuario':
        setSelectedMenu('profile');
        break;
      case '/comunidade/grupos':
        setSelectedMenu('groups');
        break;
      default:
        setSelectedMenu('');
        break;
    }
  }, [window.location.pathname]);

  let body = undefined;
  switch (selectedMenu) {
    case 'profile':
      body = <Route path='/comunidade/usuario' component={MyProfile} />;
      break;
    case 'feed':
      body = (
        <Route exact path='/comunidade' render={() => 'Feed em construção!'} />
      );
      break;
    case 'groups':
      body = (
        <Route
          path='/comunidade/grupos'
          render={() => 'Grupos em construção!'}
        />
      );
      break;
    default:
      body = '404 Não encontrado';
  }

  return (
    <div className='community-page-container'>
      <div className='community-wrapper'>
        <div className='community-menu'>
          <Menu
            mode='vertical'
            onClick={handleMenu}
            selectedKeys={[selectedMenu]}
          >
            <Menu.Item key='profile'>
              <Link to='/comunidade/usuario'>
                <Icon type='user' />
                <span>Meu Perfil</span>
              </Link>
            </Menu.Item>
            <div className='search-menu ant-menu-item custom'>
              <Input
                formItemProps={{ className: 'search-box' }}
                suffix={<Icon type='search' />}
                placeholder='Pesquisar'
              />
            </div>
            <Menu.Divider />
            <Menu.Item key='feed'>
              <Link to='/comunidade'>
                <Icon type='layout' />
                <span>Feed de notícias</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='groups'>
              <Link to='/comunidade/grupos'>
                <Icon type='team' />
                <span>Grupos</span>
              </Link>
            </Menu.Item>
            <Menu.Divider />
            {/* <div
              onClick={() => setSiderMode(!siderMode)}
              className="community-actions ant-menu-item"
            >
              <Icon type="message" />
              <span>Chat</span>
            </div> */}
          </Menu>
        </div>
        <div className='community-content'>{body}</div>
      </div>
      {/* <div className={`community-sider ${siderMode ? '' : 'hidden'}`}>
        <Button icon="close" onClick={() => setSiderMode(false)} />
        Chat em construção!
      </div> */}
    </div>
  );
};
