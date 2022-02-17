import { IVector, Vector } from "../../../common/vector";

//action: add/delete/atack/move

export interface IGameObjectContent{
  position: IVector;
  health?: number;
  playerId: string;
  primary?: boolean;
  action?: string;
  target?: Vector; 
  buildMatrix?: number[][];
}
export interface IGameObjectData{  
  type: string;//name
  objectId: string; 
  content: IGameObjectContent;
}

export interface IObject {
  deps: string[],
  name: string,
  cost: number,
  subType: string,
  time: number,
  mtx?: number[][]
 }
export interface IObjectInfo {
  object: IObject,
  status: string,
  progress: number,
}
export interface IServerRequestMessage {
  type: string;
  content: string;
}

export interface IServerResponseMessage {
  sessionID: string;
  type: string;
  content: string;
  requestId: string;
}
export interface IObjectContent{
   position: Vector,
      name: string,
      id: string,
      data: {
        health: number
      },
}

export interface IStartGameResponse {
  sidePanel: IUpdateSidePanel;
  players: string[];
  type?: 'bot'|'human'|'spectator'
}

export interface IUpdateSidePanel{
  sidePanelData: IObjectInfo[];
  money: number;

}

export interface IRegisterGamePlayerRequest{
 gameID:number;
 type: 'bot'|'human'|'spectator'
}

export interface IGameUpdateResponse{
  type: 'update' | 'delete' | 'create';
  data: IGameObjectData;
}

export interface IChatMsg{
  user: string;
  msg: string;
}
export interface IUserItem{
  name: string;
  id: string;
}

export interface ISendItemGame {
  id: number;
  credits: number;
  mapID: number;
  speed: number;
  info: string;
  users: IUserItem[];
}