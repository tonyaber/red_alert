export interface IGameObjectData{
  id: string;
  type: string;
  content: string; // or all fields
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
