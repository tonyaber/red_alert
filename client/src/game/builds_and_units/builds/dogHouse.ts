import { IGameObjectData } from '../../dto';
import { AbstractBuild } from './abstractBuild';

export class DogHouse extends AbstractBuild{
  constructor(data: IGameObjectData) {
    super(data);
  }

}