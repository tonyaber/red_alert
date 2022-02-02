import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class DefendTower extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}