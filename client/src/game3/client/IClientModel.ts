import { Vector } from "../../common/vector";
import { IGameUpdateRespone } from "../dto";
import { ClientSocket } from "./clientSocket";
import { IGameObjectData, IObjectInfo } from "./dto";

export class IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateRespone) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  onUpdate: (data: IGameObjectData) => void;
  onAddObject: (data: IGameObjectData) => void;
  // private client: ClientSocket;

  // constructor(client:ClientSocket){
    
  // }

  //side

  addUser: () => void;

  registerGamePlayer: () => void;

  startBuild: (name: string, playerId: string) => Promise<string>;

  pauseBuilding: (name: string, playerId: string) => Promise<string>;
  playBuilding: (name: string, playerId: string) => Promise<string>;
  cancelBuild: () => void;

  //to map
  addBuild: (name: string, position: Vector, playerId: string) => Promise<string>;

  setPrimary: (id: string, name: string) => Promise<string>;
  moveUnit: () => void;

  setAttackTarget: () => void;
  registerSpectator: () => void;
  //all game player methods
}
