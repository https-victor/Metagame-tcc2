import React from 'react';
import './styles/app.css';
import { Route, Switch } from 'react-router-dom';
import { LandingPage, NotFound } from './components/pages';
import { AppContext } from './hooks/contexts';
import { useApp } from './components/pages/hooks/useApp';
import { HomePage } from './components/pages/HomePage';
import { Spin } from 'antd';

function App({ props }: any) {
  
    // const [isLogged, setIsLogged] = useState(false);
    // const loginForm = useForm(loginFormValidators);
    // const signUpForm = useForm(signUpFormValidators);
  


  const {
    auth, onRequest, globalLoading, message, 
  } = useApp(props);

  let root = null;
  switch (true) {
    case auth.isLogged: {
      root = (
        <Route
          path="/"
          component={HomePage}
        />
      );
      break;
    }
    default:
      root = (
        <Route exact path="/" component={LandingPage} />
      );
  }

  return (
    <div className="app-container">
      <AppContext.Provider
        value={{
          auth,
          onRequest,
          globalLoading,
          message,
        }}
      >
        {globalLoading.state ? (
            <Spin className="spinner" />
          ) : (
        <Switch>
          {root}
          <Route component={NotFound} />
        </Switch>
        )}
      </AppContext.Provider>
    </div>
  );
}

export default App;
