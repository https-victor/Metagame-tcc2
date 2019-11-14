import React from 'react';
import { Button,Popover } from 'antd';
import { PopoverLogin } from '../business/PopoverLogin';
import Logo from '../../assets/svg/logo.svg';

export const Header = ({
  loginForm,
  loginPopOver,
  handlePopoverChange,
  history,
}: any) => (
  <div>
    <div className="page-header">
      <div className="logo-container">
        <img src={Logo} alt="" />
        <p>Metagame</p>
      </div>
      <div className="actions-container">
        <Popover
          content={(
            <PopoverLogin
              form={loginForm}
              onLogin={() => history.push('/play')}
            />
)}
          placement="bottom"
          trigger="click"
          visible={loginPopOver}
          onVisibleChange={handlePopoverChange}
        >
          <Button type="link" ghost>
            Sign In
          </Button>
        </Popover>
        <Button
          type="default"
          ghost
          onClick={() => history.push('/signup')}
        >
          Sign Up
        </Button>
      </div>
    </div>
  </div>
);
