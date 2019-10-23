import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';

ReactDOM.render(
<BrowserRouter>
    <Switch>
      <Route
        path={'/'}
        render={(props: any) => <App props={props} />}
      />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
