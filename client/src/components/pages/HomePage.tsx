import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Logo from '../../assets/svg/logo.svg';

export const HomePage = () => (
  <div className="app-container">
    <div className="page-container">
      <div className="page-header">
        <div className="logo-container">
          <img src={Logo} alt="" />
          <p>Metagame</p>
        </div>
      </div>
      <Switch>
        <Route exact path="/" render={(props: any) => 'Home'} />
        <Route path="/biblioteca" render={(props: any) => 'Biblioteca'} />
      </Switch>
    </div>
  </div>
);
