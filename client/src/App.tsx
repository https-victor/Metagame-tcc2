import React from 'react';
import './styles/app.css';
import { Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { LandingPage, NotFound } from './components/pages';
import { AppContext } from './hooks/contexts';
import { useApp } from './components/pages/hooks/useApp';
import { HomePage } from './components/pages/HomePage';

function App({ props }: any) {
  // const [isLogged, setIsLogged] = useState(false);
  // const loginForm = useForm(loginFormValidators);
  // const signUpForm = useForm(signUpFormValidators);
  const { history } = props;
  const {
    auth, onRequest, globalLoading, message, 
  } = useApp(props);

  let root = null;
  switch (true) {
    case auth.isLogged: {
      root = HomePage;
      break;
    }
    default:
      root = LandingPage;
  }
  console.log(history);
  return (
    <div className="app-container">
      <AppContext.Provider
        value={{
          auth,
          onRequest,
          globalLoading,
          message,
          history,
        }}
      >
        {globalLoading.state ? (
          <Spin className="spinner" />
        ) : (
          <Switch>
            <Route path="/" component={root} />
            <Route component={NotFound} />
          </Switch>
        )}
      </AppContext.Provider>
    </div>
  );
}

export default App;
