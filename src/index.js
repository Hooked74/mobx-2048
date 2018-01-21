import React from "react";
import ReactDOM from "react-dom";

import DevTools from "mobx-react-devtools";
import App from "./components/App";

import Game from "./models/Game";
import registerServiceWorker from "./registerServiceWorker";

import "./index.scss";

const game = new Game();

const app =
  process.env.NODE_ENV === "development" ? (
    [<DevTools key="dev" />, <App key="app" game={game} />]
  ) : (
    <App game={game} />
  );

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
