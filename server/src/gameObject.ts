import { IVector, Vector } from "../../common/vector";
import { IGameObjectContent,IGameObjectData } from "./dto";
import { PlayerSide } from "./playerSide";

export class GameObject {
  data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
    primary: false,
  };
  onUpdate: ( state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData, subType: string) => void;
  onDelete:(state: IGameObjectData) => void;
  objectId: string;

  objects: [] = [];

  subType: string;
  type: string;
  direction: Vector;
  target: Vector;

  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    this.data.position = Vector.fromIVector(state.position);
    this.target = this.data.position;
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objectId = objectId;
  }

  tick(delta: number) {
    if (Math.round(this.data.position.x) !== this.target.x && Math.round(this.data.position.y) !== this.target.y){
      this.data.position.add(this.direction.clone().scale(0.05));
      this.update();
    }
    // //logic
    // this.objects.forEach(it => {
    //   if (it) {
    //     //it._update();
    //   }
    // })
    // //
  }

  create() {
     this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    }, this.subType); 
  }

  moveUnit(target: IVector) {
    this.target = Vector.fromIVector(target);
    this.direction = Vector.fromIVector(target).clone().sub(this.data.position);  
  }

  setState(callback:(data:IGameObjectContent)=>IGameObjectContent) {
    this.data = callback(this.getState());
    this.update();
  }

  getState() {
    return this.data;
  }
  
  private update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });    
  }
}