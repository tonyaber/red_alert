import { Vector } from "../../common/vector";
import { IGameUpdateRespone } from "../dto";
import { ClientSocket } from "./clientSocket";
import { IObjectInfo } from "./dto";

export class SocketModel //implements IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateRespone) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  private client: ClientSocket;

  constructor(client:ClientSocket){
    this.client = client;
    client.onMessage = (message) => {

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

  addUser() {
    this.client.sendMessage('auth', 'user'+Math.floor(Math.random()*100))
  }

  registerGamePlayer() {
    this.client.sendMessage('registerGamePlayer', '');
  }

  startBuild(name: string, playerId: string) {
    const content = JSON.stringify({ type: 'startBuild', content: { name, playerId } });
    
    this.client.sendMessage('gameMove', content);
  }

  pauseBuild(){

  }

  cancelBuild(){

  }

  //to map
  addBuild(name: string, position: Vector, playerId: string){
    const content = JSON.stringify({ type: 'addBuild', content: { name,position, playerId } });
    
    this.client.sendMessage('gameMove', content);
  }

  setPrimary(){

  }

  moveUnit(){

  }

  setAttackTarget(){

  }

  //all game player methods
}
