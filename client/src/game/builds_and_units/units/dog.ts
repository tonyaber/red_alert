import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class Dog extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}