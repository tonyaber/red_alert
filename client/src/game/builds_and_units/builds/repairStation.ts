import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class RepairStation extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}