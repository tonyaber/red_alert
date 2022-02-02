import { Vector } from '../../../../../common/vector';
import { IGameObjectData } from '../../dto';
import { AbstractUnit } from './abstractUnit';

export class HeavyTank extends AbstractUnit{
  id: string;
  playerId: string;
  position: Vector;
  type: string;
  selected: boolean;
  constructor(data: IGameObjectData) {
    super(data);
  }

}