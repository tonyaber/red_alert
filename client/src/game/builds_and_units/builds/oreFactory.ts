import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class OreFactory extends AbstractBuild{
   id: string;
  playerId: string;
  position: Vector;
  type: string;
  primary: boolean;
   constructor(data: IGameObjectData) {
    super(data);
    
  }


  
}