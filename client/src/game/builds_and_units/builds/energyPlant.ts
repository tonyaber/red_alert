import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class EnergyPlant extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}