import { IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class DogHouse extends InteractiveObject{
  constructor(data: IGameObjectData) {
    super(data);
  }

}