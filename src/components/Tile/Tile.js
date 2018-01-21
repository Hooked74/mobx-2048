// @flow
import React, { Component } from "react";
import classNames from "class-names";

import GameModel from "../../models/Game";
import TileModel from "../../models/Tile";

// $FlowFixMe
import styleVariables from "./Tile.scss";

export interface IProps {
  tile: TileModel;
  value: number;
  x: number;
  y: number;
  isNew: boolean;
  isMerged: boolean;
}

interface IState {}

interface IStyle {
  transform: string;
}

interface ITileProps {
  className: string;
  style: IStyle;
}

interface ITileInnerProps {
  className: string;
}

/* eslint radix: off */
const cellSize = parseInt(styleVariables.gridCell);
const gap = parseInt(styleVariables.gridGap);

class Tile extends Component<IProps, IState> {
  get tileProps(): ITileProps {
    const { isNew, isMerged } = this.props;
    return {
      className: classNames("tile", {
        "tile--new": isNew,
        "tile--merged": isMerged
      }),
      style: this.style
    };
  }

  get tileInnerProps(): ITileInnerProps {
    const { value } = this.props;
    return {
      className: classNames(
        "tile__inner",
        `tile__inner--${GameModel.maxScore >= value ? value : "super"}`
      )
    };
  }

  get style(): IStyle {
    const { x, y } = this.props;
    const positionX: number = cellSize * x + gap * x;
    const positionY: number = cellSize * y + gap * y;

    return {
      transform: `translate(${positionX}px, ${positionY}px)`
    };
  }

  render() {
    const { value } = this.props;
    return (
      <div {...this.tileProps}>
        <div {...this.tileInnerProps}>{value}</div>
      </div>
    );
  }
}

export default Tile;
