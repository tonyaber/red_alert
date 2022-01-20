import { GamePlayerServer } from "./gameModelServer";
import { Vector } from '../../client/src/common/vector';
export interface IObjectInfo {
  deps: string[];
  name: string;
  cost: number;
  category: string;
  time: number;
  type: "unit" | "build";
}

export interface IObject{
  object: IObjectInfo;
  status: string;
  progress: number;
}

export interface IObjectList{
  name: string;
  health: number;
  type: "unit" | "build";
  radius?: number;
  speed?: number;
  minRadius?: number;
  reloadingTime?: number;
  bullet?: number;
  player: GamePlayerServer;
}

export interface IProgress {
  progress: number;
  name: string;
}

