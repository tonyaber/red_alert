import { IVector, Vector } from '../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../dto';
import { PlayerSide } from '../playerSide';
import { GameObject } from './gameObject';
export class RockGameObject extends GameObject{
  data: IGameObjectContent = {
    position: null,   
    playerId: null,
  };
  onUpdate: (state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete: (state: IGameObjectData) => void;
  playerSides: PlayerSide[];
  constructor(objects: Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.data.position = Vector.fromIVector(state.position);
    this.objectId = objectId;
    this.type = type;
    this.data.playerId = 'rock';
    this.subType = 'rock';
    this.playerSides = playerSides;
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

  update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });
  }
  damage(point: Vector, unit: GameObject): void {
      
  }
} 