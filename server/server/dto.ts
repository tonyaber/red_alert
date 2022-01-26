import { Vector } from "../../client/src/common/vector";

export interface IServerResponseMessage {
  type: string;
  content: string;
  requestId: string;
}
export interface IServerRequestMessage {
  type: string;
  content: string;
  requestId: string
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
  primary: boolean;
}
export interface IGameObjectData{  
  type: string;//name
  objectId: string; 
  content: IGameObjectContent;
}