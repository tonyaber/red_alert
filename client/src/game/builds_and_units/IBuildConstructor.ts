import { Vector } from "../../../../common/vector";
import { IGameObjectData } from "../dto";
import { BoundingLayer } from "../ultratiling/boundingLayer";
import { TilingLayer } from "../ultratiling/tileLayer";
import { AbstractBuild } from "./builds/abstractBuild";
import { AbstractUnit } from "./units/abstractUnit";

export interface IBuildConstructor{
  new (layer:TilingLayer, infoLayer:BoundingLayer/* infoLayer1:BoundingLayer,*/, res:Record<string, HTMLImageElement>, pos:Vector):AbstractUnit|AbstractBuild
}