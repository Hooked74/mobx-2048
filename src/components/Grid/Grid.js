// @flow
import React, { Component } from "react";
import { observer } from "mobx-react";

import Tile, { IProps as ITileProps } from "../Tile";
import Overlay, { IProps as IOverlayProps } from "../Overlay";

import GameModel from "../../models/Game";
import GridModel from "../../models/Grid";
import TileModel from "../../models/Tile";

// $FlowFixMe
import styleVariables from "./Grid.scss";

interface IProps {
  game: GameModel;
  grid: GridModel;
}

interface IState {}

// $FlowFixMe
@observer
class Grid extends Component<IProps, IState> {
  tileIds = [];

  cells = Array(styleVariables.gridSize ** 2)
    .fill()
    .map((_, i) => {
      return <div key={i} className="grid__cells" />;
    });

  getTileProps(tile: TileModel): ITileProps {
    return {
      tile,
      key: tile.id,
      x: tile.position.x,
      y: tile.position.y,
      value: tile.value,
      isNew: tile.isNew,
      isMerged: !!tile.mergedFrom
    };
  }

  get tiles(): any[] {
    const { grid } = this.props;
    let tiles = [];

    for (const { cell } of grid.iterateCells()) {
      if (cell) {
        if (cell.mergedFrom) {
          for (let mergedTile of cell.mergedFrom) {
            tiles.push(<Tile {...this.getTileProps(mergedTile)} />);
          }
        }

        tiles.push(<Tile {...this.getTileProps(cell)} />);
      }
    }

    tiles = this.sortTiles(tiles);
    this.tileIds = tiles.map(t => t.props.tile.id);

    return tiles;
  }

  get overlayProps(): IOverlayProps {
    const { game } = this.props;
    return {
      won: game.won,
      over: game.over,
      keepPlaying: game.keepPlaying,
      terminated: game.isGameTerminated.bind(game),
      reset: game.reset.bind(game),
      continueGame: () => {
        game.keepPlaying = true;
      }
    };
  }

  sortTiles(tiles: any[]): any[] {
    if (this.tileIds.length) {
      let sortableTiles = [];
      const newTiles = [];

      tiles.forEach(t => {
        const index = this.tileIds.indexOf(t.props.tile.id);

        if (index !== -1) {
          sortableTiles[index] = t;
        } else {
          newTiles.push(t);
        }
      });
      sortableTiles = sortableTiles.filter(t => typeof t !== "undefined");
      return sortableTiles.concat(newTiles);
    }

    return tiles;
  }

  render() {
    return (
      <div className="grid">
        <div className="grid__inner">
          {this.cells}
          {this.tiles}
        </div>
        <Overlay {...this.overlayProps} />
      </div>
    );
  }
}

export default Grid;
