import { IGameUpdateRespone } from "../dto";
import { ClientSocket } from "./clientSocket";
import { IObjectInfo } from "./dto";

export class SocketModel //implements IClientModel
{
  onSideUpdate: (data: {data: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateRespone) => void;
  onStartGame: (data: string) => void;
  auth: (data: string) => void;
  private client: ClientSocket;

  constructor(client:ClientSocket){
    this.client = client;
    client.onMessage = (message)=>{
      if(message.type ==='updateSidePanel'){
        this.onSideUpdate(JSON.parse(message.content))  
      }

      if (message){
        this.onCanvasObjectUpdate(message)
      }
      if (message.type === 'startGame') {
        this.onStartGame(message.content)
      }
      if (message.type === 'auth') {
        this.auth(message.content);
      }
    }
  }

  //side

  addUser() {
    this.client.sendMessage('addUser', 'user'+Math.floor(Math.random()*100))
  }

  startBuild(name: string, playerId: string){
    this.client.sendMessage('startBuild', JSON.stringify({ name, playerId }));
  }

  pauseBuild(){

  }

  cancelBuild(){

  }

  //to map
  addBuild(){

  }

  setPrimary(){

  }

  moveUnit(){

  }

  setAttackTarget(){

  }

  //all game player methods
}
