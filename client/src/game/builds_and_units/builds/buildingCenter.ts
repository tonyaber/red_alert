import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class BuildingCenter extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}