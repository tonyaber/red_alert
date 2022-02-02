import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class Radar extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}