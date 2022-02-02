import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class DogHouse extends AbstractBuild{
   id: string;
  playerId: string;
  position: Vector;
  type: string;
  primary: boolean;
   constructor(data: IGameObjectData) {
    super(data);
    this.id = data.objectId;
    this.type = data.type;
    this.updateObject(data.content);
  }

  updateObject(data: IGameObjectContent) {
    this.position = data.position;
    this.playerId = data.playerId;
    this.primary = data.primary;
  }
  
}