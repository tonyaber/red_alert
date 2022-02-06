import { IVector } from "../../../common/vector";
import { PlayerSide } from "../playerSide";
import { AbstractBuildObject } from "./builds/abstractBuildObject";
import { GameObject } from "./gameObject";
import { AbstractUnitObject } from "./units/abstractUnitObject";

export interface IGameObjectConstructor{
  new (objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }):AbstractUnitObject|AbstractBuildObject
}