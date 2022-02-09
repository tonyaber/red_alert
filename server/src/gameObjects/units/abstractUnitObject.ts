import { IVector, Vector } from "../../../../common/vector";
import { IGameObjectContent, IGameObjectData } from "../../dto";
import { PlayerSide } from "../../playerSide";
import { GameObject } from "../gameObject"
import {tracePath} from "../../trace";
import {tilesCollection, TilesCollection} from "../../tileCollection";

export class AbstractUnitObject extends GameObject{
  data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
    action: null,
    target: null
  };
  onUpdate: ( state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete:(state: IGameObjectData) => void;
  objectId: string;

  objects: Record<string, GameObject>;

  subType: string;
  type: string;
  direction: Vector;
  action: string;
  targetId: string;
  private path: Vector[];


  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.objects = objects;
    this.data.position = Vector.fromIVector(state.position);
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objectId = objectId;
    this.target=null
    this.path=[]
  }
   
    // //logic
    // this.objects.forEach(it => {
    //   if (it) {
    //     //it._update();
    //   }
    // })
    // //
  tick(delta: number) {
    //******
    if (this.action === 'move') {
      if (this.data.target && Math.round(this.data.position.x) !== this.data.target.x
          && Math.round(this.data.position.y) !== this.data.target.y){
        this.setState((data ) => {
          return {
            ...data,
            position: this.data.position.add(this.direction.clone().scale(delta * 0.0001))
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
   
  moveUnit(target: IVector,tileSize:number) {
    this.action = 'move';
    const tilesArray=tilesCollection.getTilesArray()
    this.direction = Vector.fromIVector(target).clone().sub(this.data.position);
    const targetToTile={x:Math.floor(target.x/tileSize),y:Math.floor(target.y/tileSize)}
    const positionToTile={x:Math.floor(this.data.position.x/tileSize),y:Math.floor(this.data.position.y/tileSize)}
    if(!this.path.length){
      tracePath(tilesArray,new Vector(targetToTile.x,targetToTile.y),
        new Vector(positionToTile.x,positionToTile.y),(path)=>{
          console.log("PATHES",path)
          this.path=path
          const step =this.path.pop()
          this.target=new Vector(step.x*tileSize,step.y*tileSize)
        })
    }
    console.log(this.target,'TARGET')
    if(this.target && (positionToTile.x==this.target.x/tileSize && positionToTile.y==this.target.y/tileSize)){
      const step = this.path.pop()
      console.log(this.target,'TARGETinside')
      this.target=(this.path && this.path.length>0) ? new Vector(step.x*tileSize,step.y*tileSize) :null
    }
   this.setState((data ) => {
      return {
        ...data,
        target: Vector.fromIVector(this.target),
      }
    })
  }

  attack(targetId: string) {
    this.action = 'move'; //attack
    const target = this.objects[targetId].data.position;
    this.direction = target.clone().sub(this.data.position);  
   this.setState((data ) => {
      return {
        ...data,
        target,
      }
    })
  }

  setState(callback:(data:IGameObjectContent)=>IGameObjectContent) {
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

