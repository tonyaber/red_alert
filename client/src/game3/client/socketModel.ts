import { Vector } from "../../common/vector";
import { IGameUpdateRespone } from "../dto";
import { ClientSocket } from "./clientSocket";
import { IGameObjectData, IObjectInfo } from "./dto";
import { IClientModel } from './IClientModel';
export class SocketModel implements IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateRespone) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  onUpdate: (data: IGameObjectData) => void;
  onAddObject: (data: IGameObjectData) => void;
  private client: ClientSocket;

  constructor(client:ClientSocket){
    this.client = client;
    client.onMessage = (message) => {
      if (message.type === 'update') {
        this.onUpdate(JSON.parse(message.content));
      }
      if (message.type === 'create') {
        this.onAddObject(JSON.parse(message.content));
      }

      if (message.type === 'updateSidePanel') {
        this.onSideUpdate(JSON.parse(message.content));
      }
      if (message.type === 'startGame') {
        this.onStartGame(message.content);
      }
      if (message.type === 'auth') {
        this.onAuth(message.content);
      }
    }
  }

  //side

  registerSpectator() {
    this.client.sendMessage('registerGamePlayer', JSON.stringify({ playerType: 'spectator'}));
  }
  
  addUser() {
    this.client.sendMessage('auth', 'user'+ Math.floor(Math.random()*100))
  }

  registerGamePlayer() {
    this.client.sendMessage('registerGamePlayer', JSON.stringify({ playerType: 'human'}));
  }

  startBuild(name: string, playerId: string) {
    const content = JSON.stringify({ type: 'startBuild', content: { name, playerId } });
    
    this.client.sendMessage('gameMove', content);
  }

  pauseBuilding(name: string, playerId: string){
    const content = JSON.stringify({ type: 'pauseBuild', content: { name, playerId } });
    
    this.client.sendMessage('gameMove', content);
  }

  playBuilding(name: string, playerId: string){
    const content = JSON.stringify({ type: 'playBuild', content: { name, playerId } });
    
    this.client.sendMessage('gameMove', content);
  }
  
  setTargetSpectator(targetId: string) {
    const content = JSON.stringify({type: 'setTargetSpectator', content: targetId});
    this.client.sendMessage('gameMove', content); 
  }

  cancelBuild(){

  }

  //to map
  addBuild(name: string, position: Vector, playerId: string){
    const content = JSON.stringify({ type: 'addBuild', content: { name,position, playerId } });
    this.client.sendMessage('gameMove', content);
  }

  setPrimary(id: string, name: string){
    const content = JSON.stringify({ type: 'setPrimary', content: {id, name} });
    this.client.sendMessage('gameMove', content);
  }

  moveUnit(){

  }

  setAttackTarget(){

  }

  //all game player methods
}
