import { IGameObjectData } from "../dto";
import { InteractiveObject } from "../interactiveObject";

export interface IBuildConstructor{
  new (data: IGameObjectData):InteractiveObject
}