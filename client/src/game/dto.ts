import { GamePlayer } from "./gameModel";
import { Vector } from '../common/vector';
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
  player: GamePlayer;
}

export interface IProgress {
  progress: number;
  name: string;
}

export interface ITickable{
  tick: (deltaTime: number) => void;
}