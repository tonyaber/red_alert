import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class CarFactory extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}