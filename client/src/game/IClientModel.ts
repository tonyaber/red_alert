import { Vector } from "../../../common/vector";
import { IGameUpdateResponse, IChatMsg, IUserItem} from "./dto";
import { IGameObjectData, IObjectInfo, ISendItemGame } from "./dto";
import {IGameOptions} from '../application/settingsPageMulti'

export class IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateResponse) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  onUpdate: (data: IGameObjectData) => void;
  onAddObject: (data: IGameObjectData) => void;
  onDeleteObject: (data: IGameObjectData) => void;
  onShot: (point: Vector) => void;
  onChatMsg: (msg: IChatMsg) => void;
  onUsersList: (msg: IUserItem[]) => void;
  onGamesList: (msg: ISendItemGame[]) => void;
  addUser: () => void;

  registerGamePlayer: () => void;

  startBuild: (name: string, playerId: string) => Promise<string>;

  pauseBuilding: (name: string, playerId: string) => Promise<string>;
  playBuilding: (name: string, playerId: string) => Promise<string>;
  cancelBuild: () => void;

  //to map
  addBuild: (name: string, position: Vector, playerId: string) => Promise<string>;

  addInitialData: (name: string, position: Vector, playerId: string) => Promise<string>;

  setPrimary: (id: string, name: string) => Promise<string>;
  moveUnit: (id: string, position: Vector)=> Promise<string>;

  setAttackTarget:(id: string, targetId: string)=>Promise<string>;
  registerSpectator: () => void;
  createMap: (map: number[][]) => Promise<string>;
  chatSend: (msg?: IChatMsg)=>Promise<string>;
  createGame: (msg?: IGameOptions)=>Promise<string>;
  getUsersList: (msg?: IChatMsg)=>Promise<string>;
  //all game player methods
}
