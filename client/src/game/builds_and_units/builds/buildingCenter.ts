import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class BuildingCenter extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}