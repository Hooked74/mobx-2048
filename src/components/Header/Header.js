// @flow
import React, { PureComponent } from "react";

import Score from "../Score";
import Button from "../Button";

// $FlowFixMe
import "./Header.scss";

export interface IProps {
  score: number;
  bestScore: number;
  newGame(): void;
}

interface IState {}

// $FlowFixMe
class Header extends PureComponent<IProps, IState> {
  render() {
    const { score, bestScore, newGame } = this.props;

    return (
      <div className="header">
        <div className="header__name">2048</div>
        <div className="header__scores">
          <Score title="score" number={score} />
          <Score title="best" number={bestScore} />
        </div>
        <div className="header__description">
          Join the numbers and get to the <b>2048 tile!</b>
        </div>
        <div className="header__new-game">
          <Button onClick={newGame}>New Game</Button>
        </div>
      </div>
    );
  }
}

export default Header;
