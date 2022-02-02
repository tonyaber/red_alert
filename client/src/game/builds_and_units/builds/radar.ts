import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class Radar extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}