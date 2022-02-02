import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class Barrack extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}