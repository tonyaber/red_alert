import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class Barrack extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}