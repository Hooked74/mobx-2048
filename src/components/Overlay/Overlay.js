// @flow
import React, { PureComponent } from "react";
import classNames from "class-names";

import Button from "../Button";

// $FlowFixMe
import "./Overlay.scss";

export interface IProps {
  over: boolean;
  won: boolean;
  keepPlaying: boolean;
  terminated(): boolean;
  reset(): void;
  continueGame(): void;
}

interface IState {}

class Overlay extends PureComponent<IProps, IState> {
  render() {
    let text, buttons;
    const {
      continueGame,
      reset,
      terminated,
      won,
      keepPlaying,
      over
    } = this.props;
    const overlayClassName = classNames("overlay", {
      "h-hidden": !terminated()
    });

    if (over) {
      text = "Game over";
      buttons = <Button onClick={reset}>Try again</Button>;
    } else if (won && !keepPlaying) {
      text = "You win!";
      buttons = [
        <Button onClick={continueGame} key="continue">
          Continue game
        </Button>,
        <Button onClick={reset} key="reset">
          Try again
        </Button>
      ];
    }

    return (
      <div className={overlayClassName}>
        <div className="overlay__text">{text}</div>
        <div className="overlay__buttons">{buttons}</div>
      </div>
    );
  }
}

export default Overlay;
