import { Vector } from "../../common/vector";

//action: add/delete/atack/move

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

export interface IObject {
  deps: string[],
  name: string,
  cost: number,
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