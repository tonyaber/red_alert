import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { AbstractBuild } from './abstractBuild';

export class Radar extends AbstractBuild{
  // id: string;
  // playerId: string;
  // position: Vector;
  // type: string;
  // primary: boolean;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, pos:Vector) {
    super(layer, infoLayer, res, pos);
  }
}