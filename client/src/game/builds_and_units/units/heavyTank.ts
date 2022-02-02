import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class HeavyTank extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}