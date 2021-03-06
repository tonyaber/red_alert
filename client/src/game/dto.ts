import { Vector } from "../../../common/vector";

//action: add/delete/atack/move

export interface IGameObjectContent{
  position: Vector;
  health: number;
  playerId: string;
  primary?: boolean;
  action?: string;
  target?: Vector; 
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
 type: 'bot'|'human'|'spectator'
}

export interface IGameUpdateResponse{
  type: 'update' | 'delete' | 'create';
  data: IGameObjectData;
}