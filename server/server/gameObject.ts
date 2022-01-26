import { IVector, Vector } from "../../client/src/common/vector";
import { createIdGenerator } from "../../client/src/game/idGenerator";
import { IGameObjectContent,IGameObjectData } from "./dto";

export class GameObject {
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

  objects: [] = [];

  type: string;

  constructor(objects, playerSides, objectId: string, type: string, state: { position: IVector, playerId: string }) {
    console.log(state.position);
    this.data.position = Vector.fromIVector(state.position);
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objectId = objectId;
  }

  tick(delta) {
    //logic
    this.objects.forEach(it => {
      if (it) {
        //it._update();
      }
    })
    //
  }

  create() {
     this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.data,
    }); 
  }
  update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.data,
    });    
  }
}