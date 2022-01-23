
export interface IServerResponseMessage {
  type: string;
  content: string;
  requestId: string;
}
export interface IStartGameData {
  usersInGame: string[],
  randomNumber: number,
  categories: string[],
  roomId:string,
  playerName: string,
  activePlayer: string
}
export interface IServerRequestMessage {
  type: string;
  content: string;
}

export interface IConnection {
  name: string,
 // connection: connection
}
