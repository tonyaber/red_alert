
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
 }
export interface IObjectInfo {
  object: IObject,
  status: string,
  progress: number,
}