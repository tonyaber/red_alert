import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class CarFactory extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}