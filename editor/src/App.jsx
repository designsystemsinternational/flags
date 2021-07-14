import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Editor from "./pages/Editor";

export const App = () => {
  return (
    <Router>
      <Editor />
      <Switch>
        <Route path="/">
          <Editor />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
