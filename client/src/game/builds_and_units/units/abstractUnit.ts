import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class AbstractUnit extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}