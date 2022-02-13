import { Vector } from "../../../common/vector";
import { ClientSocket } from "./clientSocket";
import { IGameObjectData, IObjectInfo, IServerResponseMessage,IGameUpdateResponse } from "./dto";
import { IClientModel } from './IClientModel';
export class SocketModel implements IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateResponse) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  onUpdate: (data: IGameObjectData) => void;
  onAddObject: (data: IGameObjectData) => void;
  onDeleteObject: (data: IGameObjectData) => void;
  onShot: (point: Vector) => void;
  private messageHandler: (message: IServerResponseMessage) => void;
  private client: ClientSocket;

  constructor(client:ClientSocket){
    this.client = client;
    this.messageHandler = (message:IServerResponseMessage) => {
      if (message.type === 'update') {
        console.log('socketModel',message.content)
        this.onUpdate(JSON.parse(message.content));
      }
      if (message.type === 'create') {
        this.onAddObject(JSON.parse(message.content));
      }
      if (message.type === 'delete') {
        this.onDeleteObject(JSON.parse(message.content));
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
      if (message.type === 'shot') {
        this.onShot(JSON.parse(message.content));
      }
    }
    this.client.onMessage.add(this.messageHandler)
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
  
  addInitialData(name: string, position: Vector, playerId: string):Promise<string>{
      const content = JSON.stringify({ type: 'addInitialData', content: { name, playerId ,position} })
    return this.client.sendMessage('gameMove', content);
  }

  startBuild(name: string, playerId: string) :Promise<string>{
    const content = JSON.stringify({ type: 'startBuild', content: { name, playerId } });
   //если будет объект, то
    // const result = this.client.sendMessage('gameMove', content).then((r)=>{
    //  const data:ТИП = JSON.stringify(r);
    // return data;
    // })
   //  return result;
    return this.client.sendMessage('gameMove', content);
  }

  pauseBuilding(name: string, playerId: string):Promise<string>{
    const content = JSON.stringify({ type: 'pauseBuild', content: { name, playerId } });
    
    return this.client.sendMessage('gameMove', content);
  }

  playBuilding(name: string, playerId: string):Promise<string>{
    const content = JSON.stringify({ type: 'playBuild', content: { name, playerId } });
    
    return this.client.sendMessage('gameMove', content);
  }
  
  setTargetSpectator(targetId: string) {
    const content = JSON.stringify({type: 'setTargetSpectator', content: targetId});
    return this.client.sendMessage('gameMove', content); 
  }

  cancelBuild(){

  }

  //to map
  addBuild(name: string, position: Vector, playerId: string):Promise<string>{
    const content = JSON.stringify({ type: 'addBuild', content: { name,position, playerId } });
    return this.client.sendMessage('gameMove', content);
  }

  setPrimary(id: string, name: string):Promise<string>{
    const content = JSON.stringify({ type: 'setPrimary', content: {id, name} });
    return this.client.sendMessage('gameMove', content);
  }

  moveUnit(id: string, position: Vector):Promise<string>{
    const content = JSON.stringify({ type: 'moveUnit', content: {id, position} });
    console.log('____>>>',content,'&')
    return this.client.sendMessage('gameMove', content);
  }

  setAttackTarget(id: string, targetId: string):Promise<string>{
    const content = JSON.stringify({ type: 'attack', content: {id, targetId} });
    return this.client.sendMessage('gameMove', content);
  }
  destroy() {
    this.client.onMessage.remove(this.messageHandler);
   }

  createMap(map: number[][]):Promise<string> {
    const content = JSON.stringify({ type: 'initialMap', content: { map } });
    return this.client.sendMessage('gameMove', content);
  }

  //all game player methods
}
