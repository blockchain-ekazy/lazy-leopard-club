import Home from "./Home"
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Contact from "./contact";

function App() {
  return (
    <Switch>
          <Route path="/contact"><Contact /></Route>
          <Route path="/"><Home /></Route>
    </Switch>
  );
}

export default App;
