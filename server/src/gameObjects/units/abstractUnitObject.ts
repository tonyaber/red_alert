import {IVector, Vector} from "../../../../common/vector";
import {IGameObjectContent, IGameObjectData} from "../../dto";
import {PlayerSide} from "../../playerSide";
import {GameObject} from "../gameObject"
import {tracePath} from "../../trace";

import {TilesCollection} from "../../tileCollection";
import {AbstractWeapon} from '../weapon/abstractWeapon';
import {AbstractBullet} from "../bullet/abstractBullet";

export class AbstractUnitObject extends GameObject {
  data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
    action: null,
    target: null
  };
  onUpdate: (state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete: (state: IGameObjectData) => void;
  objectId: string;

  objects: Record<string, GameObject>;
  attackRadius: number = 2;
  subType: string = 'unit';
  type: string;
  direction: Vector;
  action: string;
  targetId: string;
  private path: Vector[] = [];
  weapon: any;
  targetHit: Vector = null;


  constructor(objects: Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.objects = objects;
    this.data.position = Vector.fromIVector(state.position);
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objectId = objectId;
    this.target = null
    this.path = []
    this.weapon = new AbstractWeapon(AbstractBullet, this.attackRadius, 200);
    this.weapon.onBulletTarget = (point: Vector) => {
      this.onDamageTile?.(this.targetId, point);
    }
  }

  

  // //logic
  // this.objects.forEach(it => {
  //   if (it) {
  //     //it._update();
  //   }
  // })
  // //
  tick(delta: number) {
 
    if ((this.action === 'move' || this.action === 'moveToAttack') && this.target) {
      if (this.target && Math.abs(this.target.x - this.data.position.x) < 0.2 && Math.abs(this.target.y - this.data.position.y) < 0.2) {
        const step = this.path.pop();
        if (!step) {
          if (Math.abs(this.data.position.x - this.target.x) < 0.3
            && Math.abs(this.data.position.y - this.target.y) < 0.3) {
            this.target = null
           // console.log(tilesCollection.arrayTiles)
          }
          if (this.action === 'moveToAttack') {
            this.action = 'attack';
          }
        }
        else {
          this.target = new Vector(step.x, step.y)
        }
      }
      if (this.target) {
        this.setState((data) => {
          return {
            ...data,
            position: this.data.position.clone().sub(
              this.data.position.clone().sub(this.target).normalize().scale(delta * 0.001))
          };
        })
      }
      
    }
    if (this.action === 'attack') {
      if (this.objects[this.targetId]) {
        // this.weapon.position = this.data.position;
        this.weapon.position = Vector.fromIVector(this.data.position);
        this.weapon.tryShot(this.targetHit);
        this.weapon.step(delta);
      }
      else {
        this.targetId = null;
        this.action = 'idle';
      }
    }
  }

  create() {
    this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }

  getTraceMap(target: IVector) {
    const tilesArray = this.traceMap.arrayTiles
    const targetToTile = {x: Math.floor(target.x), y: Math.floor(target.y)}
    const positionToTile = {
      x: Math.floor(this.data.position.x),
      y: Math.floor(this.data.position.y)
    }
    const steps = [
      {x: -1, y: 0}, {x: 1, y: 0}, {
        x: 0,
        y: 1
      }, {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y: -1},
    ]
    let checkPoints = [positionToTile]
    const inxs = (ind: number) => {
      let points: { x: number, y: number }[] = []
      checkPoints.forEach(chP => {
        steps.forEach(step => {
          if ((chP.y + step.y) >= 0 && (chP.x + step.x) >= 0
              && (chP.y + step.y) < tilesArray.length && (chP.x + step.x) < tilesArray[0].length
              && tilesArray[chP.y + step.y][chP.x + step.x] == Number.MAX_SAFE_INTEGER) {
            tilesArray[chP.y + step.y][chP.x + step.x] = ind
            points.push({y: chP.y + step.y, x: chP.x + step.x})
          }
        })
      })
      if (points.length > 0) {
        checkPoints = points
        const isFinish = points.find(p => p.x == targetToTile.x && p.y == targetToTile.y)
        !isFinish && inxs(++ind)
        tilesArray[positionToTile.y][positionToTile.x] = 0
      }
    }
    inxs(1)
    return tilesArray
  }

  tracePathToTarget(target: IVector, action: string) {
    const traceMap = this.getTraceMap(target);
    const targetToTile = {x: Math.floor(target.x), y: Math.floor(target.y)}
    const positionToTile = {
      x: Math.floor(this.data.position.x),
      y: Math.floor(this.data.position.y)
    }
    if (this.path.length == 0) {
      //todo если будет становиться пустым то не пересчитывать опять
      tracePath(JSON.parse(JSON.stringify(traceMap)),
        new Vector(positionToTile.x, positionToTile.y),
        new Vector(targetToTile.x, targetToTile.y), (path) => {

          this.path = [new Vector(targetToTile.x + 0.5, targetToTile.y + 0.5), ...path]
          if (action === 'moveToAttack') {
            this.path = path.filter(p => {
              if (p.x + this.attackRadius < target.x || p.y + this.attackRadius < target.y) {
                return p
              }
            })
          }

          const step = this.path.pop();

          console.log('step', step)
          this.target = new Vector(step.x, step.y)
        })
    }
   
    this.setState((data) => {
      return {
        ...data,
        target: Vector.fromIVector(this.target),
      }
    })
  }

  moveUnit(target: IVector) {
    this.action = 'move';
    this.path.length = 0;
    console.log(target)
    this.tracePathToTarget(target, this.action)
  }

  attack(targetId: string) {
    this.action = 'moveToAttack'; //attack
    this.path.length = 0;
    this.targetId = targetId;
    const target = this.objects[targetId].data.position;
    this.targetHit = Vector.fromIVector(target);
    //console.log('TARGETT', target)
    this.tracePathToTarget(target, this.action)
  }

  setState(callback: (data: IGameObjectContent) => IGameObjectContent) {
    this.data = callback(this.getState());
    this.update();
  }

  getState() {
    return this.data;
  }

  update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }
}

