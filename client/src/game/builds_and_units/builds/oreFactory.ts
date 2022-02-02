import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class OreFactory extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}