import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class Soldier extends AbstractUnit{
  constructor(data: IGameObjectData) {
    super(data);
  }

}