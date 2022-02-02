import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class Truck extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }
  
}