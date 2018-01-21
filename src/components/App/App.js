// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";

import Header, { IProps as IHeaderProps } from "../Header";
import Grid from "../Grid";

import Game from "../../models/Game";

// $FlowFixMe
import "./App.scss";

interface IProps {
  game: Game;
}

interface IState {}

const KeyMap = {
  // $FlowFixMe
  38: 0, // Up
  // $FlowFixMe
  39: 1, // Right
  // $FlowFixMe
  40: 2, // Down
  // $FlowFixMe
  37: 3, // Left
  // $FlowFixMe
  75: 0, // Vim up
  // $FlowFixMe
  76: 1, // Vim right
  // $FlowFixMe
  74: 2, // Vim down
  // $FlowFixMe
  72: 3, // Vim left
  // $FlowFixMe
  87: 0, // W
  // $FlowFixMe
  68: 1, // D
  // $FlowFixMe
  83: 2, // S
  // $FlowFixMe
  65: 3 // A
};

// $FlowFixMe
@observer
class App extends Component<IProps, IState> {
  componentDidMount() {
    // $FlowFixMe
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  onKeyDown(e: KeyboardEvent) {
    const { game } = this.props;
    const terminated = game.isGameTerminated();
    const modifiers: boolean = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    const mapped: 0 | 1 | 2 | 3 = KeyMap[e.which];

    if (!modifiers && !terminated) {
      if (typeof mapped !== "undefined") {
        e.preventDefault();
        game.move(mapped);
      }
      // R key restarts the game
      if (e.which === 82) {
        e.preventDefault();
        game.reset();
      }
    }
  }

  get headerProps(): IHeaderProps {
    const { game } = this.props;
    return {
      score: game.score,
      bestScore: game.bestScore,
      newGame: game.reset.bind(game)
    };
  }

  render() {
    const { game } = this.props;

    return (
      <div className="app">
        <Header {...this.headerProps} />
        <Grid game={game} grid={game.grid} />
      </div>
    );
  }
}

export default App;
