import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';
export class EnergyPlant extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}