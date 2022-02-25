import { Vector } from "../../../../common/vector";
import { IGameObjectData } from "../dto";
import { BoundingLayer } from "../ultratiling/boundingLayer";
import { Camera } from "../ultratiling/camera";
import { TilingLayer } from "../ultratiling/tileLayer";
import { AbstractBuild } from "./builds/abstractBuild";
import { AbstractUnit } from "./units/abstractUnit";
import { Gold } from './gold';
import { Rock } from './rock';

export interface IBuildConstructor{
  new (layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData):AbstractUnit|AbstractBuild|Gold|Rock
}