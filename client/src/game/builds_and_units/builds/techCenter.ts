import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class TechCenter extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}