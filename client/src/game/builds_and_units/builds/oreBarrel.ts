import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class OreBarrel extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}