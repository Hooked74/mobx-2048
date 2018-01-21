// @flow
import { observable, action } from "mobx";

import { uniq } from "../utils";

export interface IPosition {
  x: number;
  y: number;
}

// eslint-disable-next-line
type TMergedTiles = Tile[] | null;

class Tile {
  id = uniq();

  @observable value: number = 2;
  @observable
  position: IPosition = {
    x: 0,
    y: 0
  };
  @observable
  previousPosition: IPosition = {
    x: 0,
    y: 0
  };
  @observable mergedFrom: TMergedTiles = null;
  @observable isNew = true;

  constructor(position: IPosition, value?: number) {
    // $FlowFixMe
    if (Number.isFinite(value)) this.value = value;
    this.updatePosition(position);
  }

  // $FlowFixMe
  @action("savePosition")
  savePosition() {
    Object.assign(this.previousPosition, this.position);
  }

  // $FlowFixMe
  @action("updatePosition")
  updatePosition(position: IPosition) {
    Object.assign(this.position, position);
  }
}

export default Tile;
