import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class Tank extends AbstractUnit{
  constructor(data: IGameObjectData) {
    super(data);
  }

}