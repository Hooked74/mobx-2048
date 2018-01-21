// @flow
import React, { PureComponent } from "react";

// $FlowFixMe
import "./Button.scss";

interface IProps {
  children: string;
  onClick?: () => void;
}

interface IState {}

class Button extends PureComponent<IProps, IState> {
  render() {
    const { children, onClick } = this.props;
    return (
      <button className="button" onClick={onClick}>
        {children}
      </button>
    );
  }
}

export default Button;
