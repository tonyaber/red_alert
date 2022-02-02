import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class OreFactory extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}