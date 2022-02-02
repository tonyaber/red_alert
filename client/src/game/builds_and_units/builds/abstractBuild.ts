import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class AbstractBuild extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}