import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class TechCenter extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}