// @flow
import React, { PureComponent } from "react";

// $FlowFixMe
import "./Score.scss";

interface IProps {
  title: string;
  number: number;
}

interface IState {}

class Score extends PureComponent<IProps, IState> {
  render() {
    const { title, number } = this.props;
    return (
      <div className="score">
        <div className="score__title">{title}</div>
        <div className="score__number">{number}</div>
      </div>
    );
  }
}

export default Score;
