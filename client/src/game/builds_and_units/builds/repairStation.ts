import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class RepairStation extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}