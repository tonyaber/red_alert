import { IVector, Vector } from '../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../dto';
import { PlayerSide } from '../playerSide';
import { GameObject } from './gameObject';
export class GoldGameObject extends GameObject{
  data: IGameObjectContent = {
    position: null,   
    playerId: null,
    health: null,
  };
  onUpdate: (state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete: (state: IGameObjectData) => void;
  constructor(objects: Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.data.position = Vector.fromIVector(state.position);
    this.data.health = 5;
    this.objectId = objectId;
    this.type = type;
    this.data.playerId = 'gold';
    this.subType = 'gold';
  }

  create() {
    this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }

  getState() {
    return this.data;
  }

  damage(point: Vector) {
    console.log(this.data.health)
    if (this.data.health <= 0) {
      this.destroy();
    } else if(this.data.health>0){
      //console.log(this.data.health)
      this.setState((data) => {
        return {
          ...data,
          health:this.data.health-1,
        }
      })
    } 
  }

  update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }
} 