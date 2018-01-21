// @flow
import { observable, computed, action } from "mobx";
import Tile, { IPosition } from "./Tile";

// $FlowFixMe
import styleVariables from "../variables.scss";

type TCell = Tile | null;

/* eslint radix: off */
class Grid {
  size: number = parseInt(styleVariables.gridSize);
  @observable cells: TCell[][] = this.emptyCells;

  get emptyCells(): TCell[][] {
    return Array(this.size)
      .fill()
      .map(() =>
        Array(this.size)
          .fill()
          .map(() => null)
      );
  }

  // $FlowFixMe
  @computed
  get availableCellPositions(): IPosition[] {
    const positions: IPosition[] = [];

    for (const { x, y, cell } of this.iterateCells()) {
      if (!cell) positions.push({ x, y });
    }

    return positions;
  }

  // Find the first available random position
  // $FlowFixMe
  @computed
  // $FlowFixMe
  get randomAvailableCellPosition(): IPosition {
    const positions: IPosition[] = this.availableCellPositions;

    if (positions.length) {
      return positions[Math.floor(Math.random() * positions.length)];
    }
  }

  // $FlowFixMe
  @action("insertTile")
  insertTile(tile: Tile) {
    const { x, y } = tile.position;
    this.cells[x][y] = tile;
  }

  // $FlowFixMe
  @action("removeTile")
  removeTile(tile: Tile) {
    const { x, y } = tile.position;
    this.cells[x][y] = null;
  }

  // Check if there are any cells available
  checkIfExistsAvailableCells(): boolean {
    for (const { cell } of this.iterateCells()) {
      if (!cell) return true;
    }

    return false;
  }

  // Check if the specified cell is taken
  checkIfCellIsAvailable(cellPosition: IPosition): boolean {
    return !this.checkIfCellOccupied(cellPosition);
  }

  checkIfCellOccupied(cellPosition: IPosition): boolean {
    return !!this.getCellContent(cellPosition);
  }

  getCellContent(cellPosition: IPosition): TCell {
    return this.withinBounds(cellPosition)
      ? this.cells[cellPosition.x][cellPosition.y]
      : null;
  }

  withinBounds(position: IPosition): boolean {
    const { x, y } = position;
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  // $FlowFixMe
  *iterateCells() {
    for (let [x, row] of this.cells.entries()) {
      for (let [y, cell] of row.entries()) {
        yield {
          x,
          y,
          cell
        };
      }
    }
  }
}

export default Grid;
