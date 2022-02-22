import {IVector, Vector} from "../../../../common/vector";
import {IGameObjectContent, IGameObjectData} from "../../dto";
import {PlayerSide} from "../../playerSide";
import {GameObject} from "../gameObject"
import { tracePath } from "../../trace";
import { makeCircleMap } from '../../makeCircleMap';
import {AbstractWeapon} from '../weapon/abstractWeapon';
import {AbstractBullet} from "../bullet/abstractBullet";
import { findClosestBuild, findClosestUnit, getTilingDistance } from "../../distance";
import { AbstractBuildObject } from "../builds/abstractBuildObject";
import { GoldGameObject } from "../gold";

export class AbstractUnitObject extends GameObject {
  data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
    action: "idle",
    target: null
  };
  onUpdate: (state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete: (state: IGameObjectData) => void;
  objectId: string;

  objects: Record<string, GameObject>;
  attackRadius: number = 8;
  findRadius: number = 10;
  subType: string = 'unit';
  type: string;
  direction: Vector;
  targetId: string;
  private path: Vector[] = [];
  weapon: any;
  targetHit: Vector = null;
  playerSides: PlayerSide[];


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
    
    this.weapon = new AbstractWeapon(AbstractBullet, this.attackRadius, 2500, this.objectId);
    this.weapon.moveBullet = (position: Vector, id: string) => {
      this.moveBullet(position, id);
    }
    this.weapon.onBulletTarget = (point: Vector, id: string) => {
      this.onDamageTile?.(this.targetId, point, id);
    }
    this.playerSides = playerSides;
  }

  private _handleMoveToAttack() {
     if (this.objects[this.targetId] instanceof AbstractBuildObject) {
      const map = this.objects[this.targetId].data.buildMatrix;
      const { distance, tile } = getTilingDistance(this.data.position, this.objects[this.targetId].data.position.clone(), map);
           
      if (distance < this.attackRadius) {
        this.targetHit = this.objects[this.targetId].data.position.clone().add(tile);
        this.data.action = 'attack';
        return;
      }
    } else if (this.objects[this.targetId] instanceof GoldGameObject || this.objects[this.targetId] instanceof AbstractUnitObject) {
      const dist = this.objects[this.targetId].data.position.clone().sub(this.data.position).abs();
      if (dist < this.attackRadius) {
        this.targetHit = this.objects[this.targetId].data.position.clone();
        this.data.action = 'attack';
        return;
      }
    }
  }

  private _handleMove() {
    const step = this.path.pop();
    if (!step) {
     // if (Math.abs(this.data.position.x - this.target.x) < 0.3 && Math.abs(this.data.position.y - this.target.y) < 0.3) {
        this.target = null;        
      //}
      this.data.action = 'idle';
      return;
    } 

    this.target = new Vector(step.x, step.y);
    
    if (this.traceMap.arrayTiles[Math.floor(step.y)][Math.floor(step.x)] === -1) {
      this.target = null;
      this.path.length = 0;
      this.data.action = 'idle';
      this.update();
      return;
    }   
  }

  private _handleAttack(delta: number) {
    if (this.objects[this.targetId]) {
        // this.weapon.position = this.data.position;
        this.weapon.position =this.data.position.clone();
        this.weapon.tryShot(this.targetHit);
        this.weapon.step(delta);
        // if (!this.objects[this.targetId] || this.objects[this.targetId].data.position != this.targetHit) {
        //   this.data.action = 'idle';
        // }
      }
      else {
        this.targetId = null;
        this.data.action = 'idle';
        this.update();
      }
  }

  tick(delta: number) {
    if ((this.data.action === 'move' || this.data.action === 'moveToAttack')) {
      if (this.target && Math.abs(this.target.x - this.data.position.x) < 0.2 && Math.abs(this.target.y - this.data.position.y) < 0.2) {
        if (this.data.action === 'moveToAttack') {
          this._handleMoveToAttack()
        }
      this._handleMove();  
     
        
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
    if (this.data.action === 'attack') {
      this._handleAttack(delta);
    }
    if (this.data.action === 'idle') {
      if (Math.random() > 0.03) {
        //this.findClosetEnemy();
      }
    // 
    }
    if (this.data.action === 'cash') {
     this.findClosetEnemy();
    }
  }

  findClosetEnemy() {
    
    const enemyBuilds = Object.values(this.objects).filter(item => item.data.playerId != this.data.playerId && item.subType === 'build').map(it=>it.getAllInfo());
    const enemyUnits = Object.values(this.objects).filter(item => item.data.playerId != this.data.playerId && item.subType === 'unit').map(it=>it.getAllInfo())
    const distanceBuild = findClosestBuild(this.data.position, enemyBuilds);
    const distanceUnit = findClosestUnit(this.data.position, enemyUnits);
    //console.log(distanceBuild, distanceUnit)
    if (distanceBuild.distance < distanceUnit.distance && distanceBuild.distance < this.findRadius) {
      this.attack(distanceBuild.unit.objectId);
    } else if (distanceBuild.distance > distanceUnit.distance && distanceUnit.distance < this.findRadius) {
      this.attack(distanceUnit.unit.objectId);
    }  
  }

  create() {
    this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }

  getTraceMap(target: IVector):number[][] {
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
    const circle = makeCircleMap(this.attackRadius);
    const traceMap = this.getTraceMap(target);
    if (action === 'moveToAttack') {
      circle.forEach((it, i)=> it.forEach((jt, j) => {
      if (jt===1) {
        const row = traceMap[Math.floor(i + target.y - circle.length / 2)]
        if (row) {
          row[Math.floor(j + target.x - circle.length / 2)] = Number.MAX_SAFE_INTEGER
        }
      }
      }))
    }
    
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
            
            // this.path = path.filter(p => {
            //   if (p.x + this.attackRadius < target.x || p.y + this.attackRadius < target.y) {
            //     return p
            //   }
            // })
          }

          const step = this.path.pop();
          if (step) {
            this.target = new Vector(step.x, step.y)
          }
         // console.log('step', step)
        
        })
    }
  //   if (this.target) {
  //     this.setState((data) => {
  //       return {
  //         ...data,
  //         target: Vector.fromIVector(this.target),
  //       }
  //     })
  //  }
   
  }

  moveUnit(target: IVector) {
    this.data.action = 'move';
    this.path.length = 0;
    //   console.log(target) 
    this.tracePathToTarget(target, this.data.action);
  }

  attack(targetId: string) {    
    this.data.action = 'moveToAttack'; //attack
    this.path.length = 0;
    this.targetId = targetId;
    
    if (this.objects[targetId]) {
      const target = this.objects[targetId].data.position.clone();
      this.targetHit = this.objects[targetId].data.position.clone();
      this.tracePathToTarget(target, this.data.action);
      this.update();
    }  
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
   damage(point: Vector, unit: GameObject) {
    
    if (this.data.health <= 0) {
      this.destroy();
    } else if(this.data.health>0){
      //console.log(this.data.health)
      this.setState((data) => {
        return {
          ...data,
          health:this.data.health-10,
        }
      })
    } 
  }
   destroy() {
    this.onDelete({
       type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });  
  }
}

