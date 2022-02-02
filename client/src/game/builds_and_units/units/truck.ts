import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class Truck extends AbstractUnit{
  constructor(data: IGameObjectData) {
    super(data);
  }
  
}