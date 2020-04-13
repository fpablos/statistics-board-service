import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './index.css';

import Home from './components/routes/home';
import WrappedStatistics from './components/routes/statistics';

import Menu from './components/partial/menu';
import Error404 from './components/partial/error-404';

const App = () => {
  return (
    <div className="app-container pad-one">
      <BrowserRouter>
        <Menu />
        <Switch>
          <Route exact path={["/home", "/"]}
            render={(props) => <Home {...props} />}
          />
          <Route exact path={["/statistic/:id", "/statistics/"]}
            render={(props) => <WrappedStatistics {...props} />}
          />
          <Route component={Error404} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
