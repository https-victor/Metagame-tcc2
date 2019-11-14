import React, { useContext, useState } from 'react';
import {
  Button, Icon, Menu, 
} from 'antd';
import { Input } from '../generics';
import './style/community.css';
import { AppContext } from '../../hooks/contexts';
import { MyProfile } from './MyProfile';

export const Community = () => {
  const [siderMode, setSiderMode] = useState<boolean>(true);
  //   const gameForm = useForm(gameValidators, {});
  const { onRequest, history } = useContext<any>(AppContext);

  const [selectedMenu, setSelectedMenu] = useState('feed');

  function handleMenu(e: any) {
    setSelectedMenu(e.key);
  }

  let body:any = 'Feed';
  switch (selectedMenu) {
    case 'profile':
      body = <MyProfile />;
      break;
    case 'feed':
      body = 'Feed em construção!';
      break;
    case 'groups':
      body = 'Grupos em construção!';
      break;
    default:
      body = '404 Não encontrado';
  }

  return (
    <div className="community-page-container">
      <div className="community-wrapper">
        <div className="community-menu">
          <Menu
            mode="vertical"
            onClick={handleMenu}
            selectedKeys={[selectedMenu]}
          >
            <Menu.Item key="profile">
              <Icon type="user" />
              <span>Meu Perfil</span>
            </Menu.Item>
            <div className="search-menu ant-menu-item custom">
              <Input
                formItemProps={{ className: 'search-box' }}
                suffix={<Icon type="search" />}
                placeholder="Pesquisar"
              />
            </div>
            <Menu.Divider />
            <Menu.Item key="feed">
              <Icon type="layout" />
              <span>Feed de notícias</span>
            </Menu.Item>
            <Menu.Item key="groups">
              <Icon type="team" />
              <span>Grupos</span>
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
        <div className="community-content">{body}</div>
      </div>
      {/* <div className={`community-sider ${siderMode ? '' : 'hidden'}`}>
        <Button icon="close" onClick={() => setSiderMode(false)} />
        Chat em construção!
      </div> */}
    </div>
  );
};
