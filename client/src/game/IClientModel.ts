import { Vector } from "../../../common/vector";
import { IGameUpdateResponse } from "./dto";
import { IGameObjectData, IObjectInfo } from "./dto";

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
  addUser: () => void;

  registerGamePlayer: () => void;

  startBuild: (name: string, playerId: string) => Promise<string>;

  pauseBuilding: (name: string, playerId: string) => Promise<string>;
  playBuilding: (name: string, playerId: string) => Promise<string>;
  cancelBuild: () => void;

  //to map
  addBuild: (name: string, position: Vector, playerId: string) => Promise<string>;

  addInitialDate: (name: string, position: Vector, playerId: string) => Promise<string>;

  setPrimary: (id: string, name: string) => Promise<string>;
  moveUnit: (id: string, position: Vector)=> Promise<string>;

  setAttackTarget:(id: string, targetId: string)=>Promise<string>;
  registerSpectator: () => void;

  //all game player methods
}
