import { Vector } from "../../common/vector";
// import {GameObject, MapObject, AbstractUnit, InteractiveObject} from "./interactives";
import { GameObject } from "./gameObjects/gameObject";

export function getTilingDistance(playerPosition:Vector, tilesPosition:Vector, tiles:Array<Array<number>>){
  let min = Number.MAX_SAFE_INTEGER;
  let minPosition: Vector = null;
  let absPosition = tilesPosition.clone().sub(playerPosition);
  tiles.forEach((it, y) => it.forEach((jt, x)=>{
    if (jt != 0) {
      const current = new Vector(x, y);
      const distance = new Vector(x, y).add(absPosition).abs();
      if (distance<min){
        min = distance;
        minPosition = current;
      }
    }
  }));
  return { distance: min, tile: minPosition } ;
}

// export function findClosestUnit(playerPosition:Vector, units:Array<AbstractUnit>){
//     let min = Number.MAX_SAFE_INTEGER;
//     let minIndex = -1;
//     units.forEach((it, i) => {
//       const dist = Vector.fromIVector(it.position).sub(playerPosition).abs();
//       if (dist<min){
//         min = dist;
//         minIndex = i;
//       }
//     });
//     return {distance: min, unit:units[minIndex]}
// }

export function findClosestBuild(playerPosition:Vector, builds:Array<GameObject>){
  let min = Number.MAX_SAFE_INTEGER;
  let minIndex = -1;
  let minTile:Vector = null;
  builds.forEach((it, i) => {
    const {distance: dist, tile } = getTilingDistance(playerPosition, Vector.fromIVector(it.data.position), it.buildMatrix);
    if (dist<min){
      min = dist;
      minIndex = i;
      minTile = tile;
    }
  });
  if (minIndex != -1) {
    minTile = minTile.clone().add(builds[minIndex].data.position);
  }
  return { distance: min, unit: builds[minIndex], tile: minTile };
} 