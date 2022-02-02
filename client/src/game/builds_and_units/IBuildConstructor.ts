import { IGameObjectData } from "../dto";
import { AbstractBuild } from "./builds/abstractBuild";
import { AbstractUnit } from "./units/abstractUnit";

export interface IBuildConstructor{
  new (data: IGameObjectData):AbstractUnit|AbstractBuild
}