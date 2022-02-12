import {Tile} from "./tileElement";
import {Vector} from "../../common/vector";
import {AbstractUnit} from "../../client/src/game/builds_and_units/units/abstractUnit";


export class TilesCollection {
  private tilesMap: Map<string, Tile>;
  arrayTiles:number[][]
  constructor() {
    this.tilesMap = new Map()
    this.arrayTiles=[]
  }

  addTile(coords: Record<string, number>, value: number) {
    this.tilesMap.set(`${coords.x}-${coords.y}`, new Tile(coords, value))
  }
  getTileData(key: string) {
    return this.tilesMap.get(key)
  }

  clearSubTile(s: string, unit: AbstractUnit) {
    const tile = this.getTileData(s)
    const subIndex = tile.getIndexByUnit(unit)
    // console.log('subIndex', subIndex)
    subIndex >= 0 && tile.clearSubTile(subIndex)
    return subIndex
  }

  unitChangeTile(unit: AbstractUnit, tileCoordinates: { x: any; y: any },
                 newTile: { x: number; y: number }, direction: string, subtile?: number) {
    const unitPrevSubTile = subtile ? subtile : this.clearSubTile(`${tileCoordinates.x}-${tileCoordinates.y}`, unit)
    const newTileSubTileIndex = subtile ? subtile : this.defineNewSubTileByPrevDirection(
      unitPrevSubTile, direction, newTile)
    if (typeof newTileSubTileIndex == 'number') {
      const _newTile = this.getTileData(`${newTile.x}-${newTile.y}`)
      _newTile.setSubTileUnit(unit, newTileSubTileIndex)
      return _newTile.calculatePosition(newTileSubTileIndex)
    }
    return null
  }


  defineNewSubTileByPrevDirection(prevSubTile: number, direction: string,
                                  _nextTile: { x: number, y: number }) {
    let subtile: number
    const nextX = _nextTile.x
    const nextY = _nextTile.y
    const directions:Record<string, number[]>={
      down: [1,0,2,3],
      up:[2,3,0,1],
      left:[1,3,2,0],
      right:[2,0,1,3]
    }
    if(directions[direction]){
      directions[direction].forEach(dir=>{
        this.tilesMap.get(`${nextX}-${nextY}`).subTile[dir] == null && (subtile = dir)
      })
    }else{
      if (direction === 'left-up') {
        if (prevSubTile === 1
            && this.tilesMap.get(`${nextX}-${nextY - 1}`).subTile[2] == null
            && this.tilesMap.get(`${nextX}-${nextY}`).subTile[1] == null) {
          (subtile = 1)
        }
        else if (prevSubTile === 2
                 && this.tilesMap.get(`${nextX - 1}-${nextY}`).subTile[1] == null
                 && this.tilesMap.get(`${nextX}-${nextY}`).subTile[2] == null) {
          (subtile = 2)
        }
        else {
          this.tilesMap.get(`${nextX}-${nextY}`).subTile[3] == null && (subtile = 3)
        }
      }
      else if (direction === 'right-up') {
        // console.log("Riup")
        if (prevSubTile === 0
            && this.tilesMap.get(`${nextX}-${nextY - 1}`).subTile[3] == null
            && this.tilesMap.get(`${nextX}-${nextY}`).subTile[0] == null) {
          (subtile = 0)
        }
        else if (prevSubTile === 3
                 && this.tilesMap.get(`${nextX + 1}-${nextY}`).subTile[0] == null
                 && this.tilesMap.get(`${nextX}-${nextY}`).subTile[3] == null) {
          (subtile = 3)
        }
        else {
          this.tilesMap.get(`${nextX}-${nextY}`).subTile[2] == null && (subtile = 2)
        }
      }
      else if (direction === 'right-down') {
        if (prevSubTile === 1
            && this.tilesMap.get(`${nextX}-${nextY - 1}`).subTile[2] == null
            && this.tilesMap.get(`${nextX}-${nextY}`).subTile[1] == null) {
          (subtile = 1)
        }
        else if (prevSubTile === 2
                 && this.tilesMap.get(`${nextX - 1}-${nextY}`).subTile[1] == null
                 && this.tilesMap.get(`${nextX}-${nextY}`).subTile[2] == null) {
          (subtile = 2)
        }
        else {
          this.tilesMap.get(`${nextX}-${nextY}`).subTile[0] == null && (subtile = 0)
        }
      }
      else if (direction === 'left-down') {
        if (prevSubTile === 0
            && this.tilesMap.get(`${nextX}-${nextY - 1}`).subTile[3] == null
            && this.tilesMap.get(`${nextX}-${nextY}`).subTile[0] == null) {
          (subtile = 0)
        }
        else if (prevSubTile === 3
                 && this.tilesMap.get(`${nextX - 1}-${nextY}`).subTile[0] == null
                 && this.tilesMap.get(`${nextX}-${nextY}`).subTile[3] == null) {
          (subtile = 3)
        }
        else {
          this.tilesMap.get(`${nextX}-${nextY}`).subTile[1] == null && (subtile = 1)
        }
      }
    }
    return subtile
  }

  findFreeNeighbor(tile: Tile) {
    const {x: currentX, y: currentY} = tile.coords
    const moves: number[][] = [[-1, -1], [1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [-1, 0]]
    let freeNeib: Tile = null
    for (let i = 0; i < moves.length; i++) {
      if (this.getTileData(`${currentX + moves[i][0]}-${currentY + moves[i][1]}`).occupancyRatio == 0) {
        freeNeib = this.getTileData(`${currentX + moves[i][0]}-${currentY + moves[i][1]}`)
        break
      }
    }
    return freeNeib

  }

  rewriteTiles(tile: Tile, newTile: Tile) {
    const units = tile.subTile
    tile.subTile = [null, null, null, null]
    tile.occupancyRatio = 0
    newTile.subTile = units
    newTile.occupancyRatio = 4
    units.forEach(unit => unit.tileCoordinates = {x: newTile.coords.x, y: newTile.coords.y})
    return units.every(e => e.target === null) && true
  }

  createTilesMap(map: Array<Array<number>>) {
    this.tilesMap=new Map()
    for(let h=0;h<map.length;h++){
      const row=[]
      for(let w=0;w<map[0].length;w++){
          this.addTile({x:w,y:h},0)
        row.push(Number.MAX_SAFE_INTEGER)
      }
      this.arrayTiles.push(row)
    }
  }
  getTilesMap(){
    return this.tilesMap
  }
  getTilesArray(){
    return this.arrayTiles
  }

  addBuild(buildPos: Vector[]) {
   buildPos.forEach(b=>{
      this.getTileData(`${b.x}-${b.y}`).occupancyRatio=4
      this.arrayTiles[b.y][b.x]=-1
    })
  }

}
export const tilesCollection=new TilesCollection()
