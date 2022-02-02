import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class HeavyTank extends AbstractUnit{
  constructor(data: IGameObjectData) {
    super(data);
  }

}