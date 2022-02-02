import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class Dog extends AbstractUnit{
  constructor(data: IGameObjectData) {
    super(data);
  }

}