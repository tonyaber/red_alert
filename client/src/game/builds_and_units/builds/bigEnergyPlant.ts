import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class BigEnergyPlant extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}