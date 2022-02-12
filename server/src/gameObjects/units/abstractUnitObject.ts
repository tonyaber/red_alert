import {IVector, Vector} from "../../../../common/vector";
import {IGameObjectContent, IGameObjectData} from "../../dto";
import {PlayerSide} from "../../playerSide";
import {GameObject} from "../gameObject"
import {tracePath} from "../../trace";
import { tilesCollection, TilesCollection } from "../../tileCollection";
import { AbstractWeapon } from '../weapon/abstractWeapon';
import { AbstractBullet } from "../bullet/abstractBullet";

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
attackRadius:number = 2;
  subType: string = 'unit';
  type: string;
  direction: Vector;
  action: string;
  targetId: string;
  private path: Vector[];
 
  weapon: any;


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
      //console.log(this.data.position)
      //todo tileSize подумасть пока костыль this.tileSize
     if (Math.abs(Math.floor(this.data.position.x) - this.target.x) <= 10
          && Math.abs(Math.floor(this.data.position.y) - this.target.y) <= 10) {
        const step = this.path.pop()
        if (!step) {
          //this.target = null
          if(this.action === 'moveToAttack'){
            this.action = 'attack';
          }
        }
        else {
          this.target = new Vector(step.x, step.y)
        }
      }

      if (this.target && Math.round(this.data.position.x) !== this.target.x
          && Math.round(this.data.position.y) !== this.target.y) {
        this.setState((data) => {
          return {
            ...data,
              position: this.data.position.clone().sub(
              this.data.position.clone().sub(this.target).clone().normalize().scale(delta * 0.001))
          };
        })
      }
    }

    if (this.action === 'attack') {
      if (this.objects[this.targetId]) {
       // this.weapon.position = this.data.position;
        this.weapon.position = this.data.position;
        this.weapon.tryShot(this.target);
        this.weapon.step(delta);
      } else {
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
    const tilesArray = tilesCollection.getTilesArray().map(e => e)
    
    const targetToTile = {x: Math.floor(target.x ), y: Math.floor(target.y )}
    const positionToTile = {
      x: Math.floor(this.data.position.x ),
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
              && tilesArray[chP.y + step.y][chP.x + step.x] == 0) {
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
    console.log(traceMap)
  //console.log("TRR",traceMap)
  const targetToTile = {x: Math.floor(target.x ), y: Math.floor(target.y )}
  const positionToTile = {
    x: Math.floor(this.data.position.x ),
    y: Math.floor(this.data.position.y )
  }
  if (this.path.length == 0) {
    //todo если будет становиться пустым то не пересчитывать опять
    tracePath(traceMap, 
      new Vector(positionToTile.x, positionToTile.y), new Vector(targetToTile.x, targetToTile.y), (path) => {
        //console.log("PATHES",path)
        //console.log('pos',this.data.position)
       
        this.path = path
        if(action==='moveToAttack'){
          this.path =path.filter(p=>{
            if(p.x+this.attackRadius<target.x || p.y+this.attackRadius<target.y){
              return p
            }
          })
       }
       console.log('PATH', path)
       
        
        const step = this.path.pop();

        //  console.log(step.x*tileSize,step.y*tileSize,step.x,step.y)
        this.target = new Vector(step.x , step.y )
      })
  }
  //  console.log(this.target,'TARGET')


  this.setState((data) => {
    return {
      ...data,
      target: Vector.fromIVector(this.target),
    }
  })
}
  moveUnit(target: IVector) {
    this.action = 'move';
    console.log(target);
   this.tracePathToTarget(target, this.action)
  }

  attack(targetId: string) {
    this.action = 'moveToAttack'; //attack
    this.targetId = targetId;
    const target = this.objects[targetId].data.position;
    
    console.log('TARGETT', target)
   this.tracePathToTarget(target,this.action)
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

