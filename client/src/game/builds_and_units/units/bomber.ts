import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class Bomber extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}