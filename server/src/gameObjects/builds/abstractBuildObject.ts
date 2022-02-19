import { IVector, Vector } from "../../../../common/vector";
import { IGameObjectContent, IGameObjectData } from "../../dto";
import { PlayerSide } from "../../playerSide";
import { GameObject } from "../gameObject"

export class AbstractBuildObject extends GameObject{
   data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
     primary: false,
     buildMatrix: null,
  };
  onUpdate: ( state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete:(state: IGameObjectData) => void;
  objectId: string;

  objects: Record<string, GameObject> = {};

  subType: string = 'build';
  type: string;
  playerSides: PlayerSide[];

  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.data.position = Vector.fromIVector(state.position);
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objects = objects;
    this.objectId = objectId;
    this.data.buildMatrix = [
      [0,1,1,0],
      [1,1,1,1],
      [1,1,1,1],
      [1,1,1,1],
    ];
    this.playerSides = playerSides;
  }
  
  create() {
     this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    }); 
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