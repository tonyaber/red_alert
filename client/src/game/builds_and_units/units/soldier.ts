import { Vector } from '../../../../../common/vector';
import { IGameObjectData } from '../../dto';
import { InteractiveList } from '../../interactiveList';
import { InteractiveObject } from '../../interactiveObject';

export class Soldier extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}