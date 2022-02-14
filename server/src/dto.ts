import { Vector } from "../../common/vector";

export interface IServerResponseMessage {
  type: string;
  content: string;
  requestId: string;
}
export interface IServerRequestMessage {
  type: string;
  content: string;
  requestId: string;
}

export interface IRegisteredPlayerInfo{
  id:string,
  type: 'bot'|'human'|'spectator'
  connection?: any;//connection
}

export interface IObject {
  deps: string[],
  name: string,
  cost: number,
  time: number,
  subType: string,
  spawn: string,
 }
export interface IObjectInfo {
  object: IObject,
  status: string,
  progress: number,
}

export interface ITickable{
  tick: (deltaTime: number) => void;
}
export interface IGameObjectContent{
  position: Vector;
  health: number;
  playerId: string;
  primary?: boolean;
  action?: string;
  target?: Vector; 
  buildMatrix?: number[][],
}
export interface IGameObjectData{  
  type: string;//name
  objectId: string; 
  content: IGameObjectContent;
}

export interface ISidePanelData{
    sidePanelData: IObjectInfo[];
    money: number;
}

export interface IStartGameResponse {
  sidePanel: ISidePanelData;
  players: string[];
  type?: 'bot' | 'human' | 'spectator',
}

export interface IUpdateSidePanel{
  sidePanelData: IObjectInfo[];
  money: number;
}