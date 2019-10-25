import React, { useState, useContext } from 'react';
import { Button, Popover } from 'antd';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { Welcome } from './Welcome';
import { SignUp } from './SignUp';
import { PopoverLogin } from '../business/PopoverLogin';
import Logo from '../../assets/svg/logo.svg';
import { useForm } from '../../hooks/generics/useForm';
import {
  loginFormValidators,
  signUpFormValidators,
} from '../../utils/validators';
import { AppContext } from '../../hooks/contexts';
import { formatterLoginFormErrors, formatterSignUpFormErrors } from '../../utils/formatters';

export const LandingPage = () => {
  const { auth, message, history } = useContext<any>(AppContext);
  const [loginPopOver, setLoginPopOver] = useState(false);
  const loginForm = useForm(loginFormValidators);
  const signUpForm = useForm(signUpFormValidators);
  function handlePopoverChange(visible: any) {
    setLoginPopOver(visible);
  }

  async function onLogin(e: any) {
    e.preventDefault();
    loginForm.onSet({ credentials: undefined }, 'errors');
    try {
      const json = await loginForm.onSubmit(
        {
          path: 'auth',
          method: 'POST',
          body: {
            email: loginForm.values.email,
            password: loginForm.values.password,
          },
        },
        formatterLoginFormErrors,
      );
      auth.onLogin(json.token);
    } catch (e) {
      message.handleErrors(
        e,
        'Por favor, preencha os campos obrigatórios do formulário!',
      );
    }
  }

  async function onSignUp(e: any) {
    e.preventDefault();
    signUpForm.onSet({ credentials: undefined }, 'errors');
    try {
      const json = await signUpForm.onSubmit(
        {
          path: 'users',
          method: 'POST',
          body: {
            name: signUpForm.values.name,
            email: signUpForm.values.email,
            password: signUpForm.values.password,
          },
        },
        formatterSignUpFormErrors,
      );
      history.push('/');
      auth.onLogin(json.token);
    } catch (e) {
      message.handleErrors(
        e,
        'Por favor, preencha os campos obrigatórios do formulário!',
      );
    }
  }
  
  return (
    <div className="app-container">
      <div className="page-container">
        <div className="page-header">
          <div className="logo-container">
            <img src={Logo} alt="" />
            <p>Metagame</p>
          </div>
          <div className="actions-container">
            <Popover
              content={<PopoverLogin form={loginForm} onLogin={onLogin} />}
              placement="bottom"
              trigger="click"
              visible={loginPopOver}
              onVisibleChange={handlePopoverChange}
            >
              <Button type="link" ghost>
                Entrar
              </Button>
            </Popover>
            <Link to="/signup">
              <Button type="default" ghost>
                Cadastrar-se
              </Button>
            </Link>
          </div>
        </div>
        <Switch>
          <Route
            path="/signup"
            render={(props: any) => (
              <SignUp
                form={signUpForm}
                onSignUp={onSignUp}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={(props: any) => <Welcome />}
          />
        </Switch>
      </div>
    </div>
  );
};
