import {IVector, Vector} from "../../../../common/vector";
import {IGameObjectContent, IGameObjectData} from "../../dto";
import {PlayerSide} from "../../playerSide";
import {GameObject} from "../gameObject"
import {tracePath} from "../../trace";
import {tilesCollection, TilesCollection} from "../../tileCollection";

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
attackRadius:number = 3;
  subType: string;
  type: string;
  direction: Vector;
  action: string;
  targetId: string;
  private path: Vector[];
  private tileSize: number;


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

  }

  // //logic
  // this.objects.forEach(it => {
  //   if (it) {
  //     //it._update();
  //   }
  // })
  // //
  tick(delta: number) {
   if ((this.action === 'move'||this.action === 'moveToAttack') && this.target) {
    // console.log('this.data.position',this.data.position)
    // console.log('this.target',this.target)
      //todo tileSize подумасть пока костыль this.tileSize
     if (Math.abs(Math.floor(this.data.position.x) - this.target.x) <= 10
          && Math.abs(Math.floor(this.data.position.y) - this.target.y) <= 10){


     //  this.data.position=this.target
      const step = this.path.pop()
       console.log("SPET-tick",step)
        if (!step) {
          console.log("SPET-NOTTTTTTTTTTT",step)
          this.target = null
          if(this.action === 'moveToAttack'){
            this.action='attack'
          }
        }
        else{
          this.target = new Vector(step.x * this.tileSize, step.y * this.tileSize)
        }
      }

      if (this.target && Math.round(this.data.position.x) !== this.target.x
          && Math.round(this.data.position.y) !== this.target.y) {
        this.setState((data) => {
          return {
            ...data,
              position: this.data.position.clone().sub(
              this.data.position.clone().sub(this.target).clone().normalize().scale(2))
          };
        })
      }
    }
    //написать логику движения до врага

    if (this.action === 'attack') {
      //to do something
    }
  }

  create() {
    this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }

  getTraceMap(target: IVector, tileSize: number) {
    const tilesArray = tilesCollection.getTilesArray().map(e => e)
    const targetToTile = {x: Math.floor(target.x / tileSize), y: Math.floor(target.y / tileSize)}
    const positionToTile = {
      x: Math.floor(this.data.position.x / tileSize),
      y: Math.floor(this.data.position.y / tileSize)
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
tracePath(target: IVector, tileSize: number,action:string){
  const traceMap = this.getTraceMap(target, tileSize)
  const targetToTile = {x: Math.floor(target.x / tileSize), y: Math.floor(target.y / tileSize)}
  const positionToTile = {
    x: Math.floor(this.data.position.x / tileSize),
    y: Math.floor(this.data.position.y / tileSize)
  }
  console.log('---->',targetToTile,positionToTile)
  console.log(this.path.length,'LENG')
  if (this.path.length == 0 ) {
    //todo если будет становиться пустым то не пересчитывать опять
    tracePath(traceMap,
      new Vector(positionToTile.x, positionToTile.y), new Vector(targetToTile.x, targetToTile.y), (path) => {
       this.path = [new Vector(targetToTile.x,targetToTile.y),...path]
        if(action==='moveToTile'){
          this.path =path.filter(p=>{
            if(p.x+this.attackRadius<target.x || p.y+this.attackRadius<target.y){
              return p
            }
          })
        }
        this.tileSize = tileSize
        console.log(this.path,'^^^')
        const step = this.path.pop()
          console.log('step',step)
        this.target = new Vector(step.x * tileSize, step.y * tileSize)
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
  moveUnit(target: IVector, tileSize: number) {
    this.action = 'move';
    this.path=[]
    console.log("MOVE",target)
   this.tracePath(target, tileSize,this.action)
  }

  attack(targetId: string) {
    this.action = 'moveToAttack'; //attack
    const target = this.objects[targetId].data.position;
   this.tracePath(target, 50,this.action)
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

