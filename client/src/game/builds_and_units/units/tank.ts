import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class Tank extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}