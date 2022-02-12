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
  };
  onUpdate: ( state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete:(state: IGameObjectData) => void;
  objectId: string;

  objects: Record<string, GameObject> = {};

  subType: string = 'build';
  type: string;
  buildMatrix: number[][];

  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.data.position = Vector.fromIVector(state.position);
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objectId = objectId;
    this.buildMatrix = [
      [0,1,1,0],
      [1,1,1,1],
      [1,1,1,1],
      [1,1,1,1],
    ];
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
}