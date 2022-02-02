import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class DefendTower extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}