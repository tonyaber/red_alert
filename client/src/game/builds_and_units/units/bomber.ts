import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class Bomber extends AbstractUnit{
  constructor(data: IGameObjectData) {
    super(data);
  }

}