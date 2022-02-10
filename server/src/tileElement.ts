import {TilesCollection} from "./tileCollection";
import {Vector} from "../../common/vector";
import {AbstractUnit} from "../../client/src/game/builds_and_units/units/abstractUnit";

export class Tile {

  position: Vector
  public occupancyRatio: number;
  public subTile: any[];
  public coords: Record<string, number>;

  constructor(coords: Record<string, number>, value: number) {
    this.coords = coords
    this.occupancyRatio = value
    this.subTile = [null, null, null, null]
  }

  getTileUnits() {
    return this.subTile
  }

  newSubtileInside(unit: AbstractUnit, currentSub: number, newSubtile: number) {
    if (currentSub === newSubtile) {
      // console.log('newSubtileInside',currentSub,newSubtile)
      return this.calculatePosition(newSubtile)
    }
    this.subTile[currentSub] = null
    this.subTile[newSubtile] = unit
    //  console.log('newSubtileInside', this.subTile)
    return this.calculatePosition(newSubtile)
  }

  setTilePosition(_position: Vector) {
    this.position = _position
  }

  getIndexByUnit(unit: AbstractUnit) {
    //console.log(this.subTile)
    return this.subTile.findIndex(e => e === unit)
  }

  calculatePosition(index: number) {
    return index == 1 ? {x: 37, y: 10} : index == 2 ? {x: 10, y: 37} : index == 3 ? {x: 37, y: 37} : {x: 10, y: 10}
  }

  findEmptySubTile() {
    return this.subTile.findIndex(e => !e)
  }

  setSubTileUnit(unit: AbstractUnit, tileIndex?: number) {
    let freeIndex: number
    if (this.occupancyRatio < 4) {
      if (this.subTile[tileIndex] == null) {
        freeIndex = tileIndex
        this.subTile[tileIndex] = unit
        this.occupancyRatio = this.subTile.filter(e => e).length
      }
      else {
        const isHasEmpty = this.subTile.findIndex(e => e == null)
        if (isHasEmpty) {
          this.subTile[isHasEmpty] = unit
          freeIndex = isHasEmpty
          this.occupancyRatio = this.subTile.filter(e => e).length
        }
        else console.log("FULL setSubTileUnit")
      }
    }
    // console.log(this.subTile, '?????')
    return this.calculatePosition(tileIndex)

  }

  clearSubTile(subTileIndex: number) {
    this.subTile[subTileIndex] = null
    this.occupancyRatio = this.subTile.filter(e => e).length
  }

  setTotalOccupancy() {
    this.occupancyRatio = 5
    for (let i = 0; i < this.subTile.length; i++) {
      this.subTile[i] = 5
    }
  }

  clearTotalOccupancy() {
    this.occupancyRatio = 0
    for (let i = 0; i < this.subTile.length; i++) {
      this.subTile[i] = 0
    }
  }

//todo
  //multiselect class

  defineSubtileByNextStepDirection(nextDirection: string, currentSubtile: number,
                                   tilesCollection: TilesCollection) {
    let subtile: number
    // console.log(this.coords,'define SubtileByNextStepDirection')
    if (nextDirection === 'up') {
      currentSubtile === 2 && (subtile = 0)
      currentSubtile === 3 && (subtile = 1)
      currentSubtile === 0 && (subtile = currentSubtile)
      currentSubtile === 1 && (subtile = currentSubtile)
    }
    else if (nextDirection === 'left-up') {
      if (tilesCollection.getTileData(
        `${this.coords.x}-${this.coords.y - 1}`).subTile[2] === null
          && currentSubtile === 1) {
        subtile = 1
      }
      else if (tilesCollection.getTileData(
        `${this.coords.x - 1}-${this.coords.y}`).subTile[1] === null
               && currentSubtile === 2) {
        subtile = 2
      }
      else {
        subtile = 0
      }

    }
    else if (nextDirection === 'right-up') {
      if (tilesCollection.getTileData(
        `${this.coords.x}-${this.coords.y - 1}`).subTile[3] === null
          && currentSubtile === 0) {
        subtile = 0
      }
      else if (tilesCollection.getTileData(
        `${this.coords.x + 1}-${this.coords.y}`).subTile[0] === null
               && currentSubtile === 3) {
        subtile = 3
      }
      else {
        subtile = 1
      }
    }
    else if (nextDirection === 'left') {
      currentSubtile === 1 ? subtile = 0 : currentSubtile === 3 ? subtile = 2 : subtile = currentSubtile
    }
    else if (nextDirection === 'right') {
      currentSubtile === 0 ? subtile = 1 : currentSubtile === 2 ? subtile = 3 : subtile = currentSubtile
    }
    else if (nextDirection === 'down') {
      currentSubtile === 0 ? subtile = 2 :
        currentSubtile === 1 ? subtile = 3 : subtile = currentSubtile
    }
    else if (nextDirection === 'right-down') {
      if (tilesCollection.getTileData(
        `${this.coords.x + 1}-${this.coords.y}`).subTile[2] === null
          && currentSubtile === 1) {
        subtile = 1
      }
      else if (tilesCollection.getTileData(
        `${this.coords.x}-${this.coords.y + 1}`).subTile[1] === null
               && currentSubtile === 2) {
        subtile = 2
      }
      else {
        subtile = 3
      }
    }
    else if (nextDirection === 'left-down') {
      if (tilesCollection.getTileData(
        `${this.coords.x - 1}-${this.coords.y}`).subTile[3] === null
          && currentSubtile === 0) {
        subtile = 0
      }
      else if (tilesCollection.getTileData(
        `${this.coords.x}-${this.coords.y + 1}`).subTile[0] === null
               && currentSubtile === 3) {
        subtile = 3
      }
      else {
        subtile = 2
      }
    }
    // console.log(subtile,'EnddefineSubtileByNextStepDirection')
    return subtile
  }
}