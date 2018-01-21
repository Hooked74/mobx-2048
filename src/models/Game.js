// @flow
import { observable, action } from "mobx";
import Grid from "./Grid";
import Tile, { IPosition } from "./Tile";

interface IVector {
  x: number;
  y: number;
}

interface ITraversals {
  x: number[];
  y: number[];
}

interface IFarthestPosition {
  previous: IPosition;
  next: IPosition;
}

type TDirection = 0 | 1 | 2 | 3;

/* eslint radix: off */
class Game {
  static maxScore: number = 2048;

  @observable won: boolean = false;
  @observable over: boolean = false;
  @observable keepPlaying: boolean = false;
  @observable score: number = 0;
  @observable
  bestScore: number = parseInt(localStorage.getItem("score")) || this.score;
  @observable grid: Grid = new Grid();

  startTiles: number = 2;
  vectorsMap: IVector[] = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 }, // Right
    { x: 0, y: 1 }, // Down
    { x: -1, y: 0 } // Left
  ];

  constructor() {
    this.addStartTiles();
  }

  // $FlowFixMe
  @action("updateBestScore")
  updateBestScore() {
    if (this.bestScore < this.score) {
      this.bestScore = this.score;
      localStorage.setItem("score", this.score.toString());
    }
  }

  // Move a tile and its representation
  // $FlowFixMe
  @action("moveTile")
  moveTile(tile: Tile, cellPosition: IPosition) {
    this.grid.cells[tile.position.x][tile.position.y] = null;
    this.grid.cells[cellPosition.x][cellPosition.y] = tile;
    tile.updatePosition(cellPosition);
  }

  // Move tiles on the grid in the specified direction
  // 0: up, 1: right, 2: down, 3: left
  // $FlowFixMe
  @action("move")
  move(direction: TDirection) {
    if (this.isGameTerminated()) return; // Don't do anything if the game's over

    //var cell, tile;

    const vector: IVector = this.getVector(direction);
    const traversals: ITraversals = this.buildTraversals(vector);
    let moved = false,
      cellPosition,
      tile;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    for (const x of traversals.x) {
      for (const y of traversals.y) {
        cellPosition = { x, y };
        tile = this.grid.getCellContent(cellPosition);

        if (tile) {
          const farthestPosition: IFarthestPosition = this.findFarthestPosition(
            cellPosition,
            vector
          );
          const nextTile: Tile | null = this.grid.getCellContent(
            farthestPosition.next
          );

          // Only one merger per row traversal?
          if (
            nextTile &&
            nextTile.value === tile.value &&
            !nextTile.mergedFrom
          ) {
            const mergedTile = new Tile(farthestPosition.next, tile.value * 2);
            mergedTile.mergedFrom = [tile, nextTile];
            mergedTile.isNew = false;

            this.grid.insertTile(mergedTile);
            this.grid.removeTile(tile);

            // Converge the two tiles' positions
            tile.updatePosition(farthestPosition.next);

            // Update the score
            this.score += mergedTile.value;

            // The mighty 2048 tile
            if (mergedTile.value === Game.maxScore) this.won = true;
          } else {
            this.moveTile(tile, farthestPosition.previous);
          }

          if (
            !(
              cellPosition.x === tile.position.x &&
              cellPosition.y === tile.position.y
            )
          ) {
            moved = true; // The tile moved from its original cell!
          }
        }
      }
    }

    if (moved) {
      this.addRandomTile();

      if (!this.checkIfTilesCanBeMoved()) {
        this.over = true; // Game over!
      }

      this.updateBestScore();
    }
  }

  findFarthestPosition(
    cellPosition: IPosition,
    vector: IVector
  ): IFarthestPosition {
    let previousPosition;

    // Progress towards the vector direction until an obstacle is found
    do {
      previousPosition = cellPosition;
      cellPosition = {
        x: previousPosition.x + vector.x,
        y: previousPosition.y + vector.y
      };
    } while (
      this.grid.withinBounds(cellPosition) &&
      this.grid.checkIfCellIsAvailable(cellPosition)
    );

    return {
      previous: previousPosition,
      next: cellPosition // Used to check if a merge is required
    };
  }

  // Build a list of positions to traverse in the right order
  buildTraversals(vector: IVector): ITraversals {
    const traversals: ITraversals = { x: [], y: [] };

    for (let pos: number = 0; pos < this.grid.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
  }

  // Get the vector representing the chosen direction
  getVector(direction: TDirection): IVector {
    // Vectors representing tile movement
    return this.vectorsMap[direction];
  }

  // $FlowFixMe
  @action("prepareTiles")
  prepareTiles() {
    for (const { cell } of this.grid.iterateCells()) {
      if (cell) {
        cell.mergedFrom = null;
        cell.isNew = false;
        cell.savePosition();
      }
    }
  }

  // Set up the initial tiles to start the game with
  addStartTiles() {
    for (let i: number = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  // Adds a tile in a random position
  addRandomTile() {
    if (this.grid.checkIfExistsAvailableCells()) {
      const value: number = Math.random() < 0.9 ? 2 : 4;
      const tile: Tile = new Tile(this.grid.randomAvailableCellPosition, value);

      this.grid.insertTile(tile);
    }
  }

  checkIfTilesCanBeMoved(): boolean {
    return (
      this.grid.checkIfExistsAvailableCells() || this.lookingToMergeTiles()
    );
  }

  // Check for available matches between tiles (more expensive check)
  lookingToMergeTiles(): boolean {
    for (const { x, y, cell } of this.grid.iterateCells()) {
      if (cell) {
        for (
          let direction: TDirection = 0;
          direction < this.vectorsMap.length;
          // $FlowFixMe
          direction++
        ) {
          const vector: IVector = this.getVector(direction);
          const nearestСell: Tile | null = this.grid.getCellContent({
            x: x + vector.x,
            y: y + vector.y
          });

          if (nearestСell && nearestСell.value === cell.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }

    return false;
  }

  isGameTerminated(): boolean {
    return this.over || (this.won && !this.keepPlaying);
  }

  // $FlowFixMe
  @action("reset")
  reset() {
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.score = 0;
    this.grid = observable(new Grid());
    this.addStartTiles();
  }
}

export default Game;
