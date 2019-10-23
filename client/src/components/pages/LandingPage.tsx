import React from 'react';
import { Button, Popover } from 'antd';
import { Welcome } from './Welcome';
import { Route } from 'react-router';
import { SignUp } from './SignUp';
import { Link } from 'react-router-dom';
import { PopoverLogin } from '../business/PopoverLogin';
import Logo from '../../assets/svg/logo.svg';

export const LandingPage = ({ push }: any) => (
  <div className="app-container">
        <div className="page-container">
          <div className="page-header">
            <div className="logo-container">
              <img src={Logo} alt="" />
              <p>Metagame</p>
            </div>
            <div className="actions-container">
              {/* <Popover
                content={<PopoverLogin form={loginForm} onLogin={onLogin} />}
                placement="bottom"
                trigger="click"
                visible={loginPopOver}
                onVisibleChange={handlePopoverChange}
              >
                <Button type="link" ghost>
                  Sign In
                </Button>
              </Popover> */}
              <Link to="/signup">
                <Button type="default" ghost>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          <Route
            path="/signup"
            render={(props: any) => (
              'Signup'
              // <SignUp
              //   form={signUpForm}
              //   onSignUp={() => props.history.push('/')}
              // />
            )}
          />
          <Route exact path="/" render={(props:any) => <Welcome push={props.history.push} />} />
        </div>
    </div>
  
);
