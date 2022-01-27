import { IObjectInfo, IRegisteredPlayerInfo, IServerRequestMessage, IStartGameResponse } from "./dto";
import { GameModel } from "./gameModel";
import { connection } from "websocket";
import { BotCommander } from './botCommander';
import { HumanCommander } from "./humanCommander";
import { PlayerController } from "./playerController";

export class GameServer{
  registeredPlayersInfo: IRegisteredPlayerInfo[] = [];

  players: (HumanCommander|BotCommander)[] = [];
  gameModel: GameModel;
  constructor(){
    
  }

  registerPlayer(type:'bot'|'human'|'spectator', userId:string, connection:connection){
    this.registeredPlayersInfo.push({ type, id: userId, connection });
    if (this.registeredPlayersInfo.length >= 2) {
      this.startGame();
    }
  }

  startGame() {
    this.gameModel = new GameModel(this.registeredPlayersInfo);
    this.players = this.registeredPlayersInfo.map(it=> {
      const playerController = new PlayerController(it.id, this.gameModel);
      return new (it.type == 'bot'? BotCommander : HumanCommander)(playerController, it.connection );
    });
  //create, delete
    this.gameModel.onUpdate = (data, action)=>{
      if (action === 'update') {
         this.players.forEach(player => player.sendMessage('update', JSON.stringify(data)));
      }
      if (action === 'create') {
        this.players.forEach(player => player.sendMessage('create', JSON.stringify(data)));
      }
      if(action === 'delete'){

      }
     
    }
    this.gameModel.onSideUpdate = (id, data)=>{
      this.players.find(it=>it.playerController.playerId === id).sendMessage('updateSidePanel', data);
    }
    
    ///start to game, fix it later
    const allPlayers = this.registeredPlayersInfo.map(it => it.id);
    this.players.forEach(item => {
      const sidePanel = this.gameModel.getState(item.playerController.playerId);
      const response:IStartGameResponse = { players: allPlayers, sidePanel}
      item.sendMessage('startGame', JSON.stringify(response));
      
    })
  }
 
  handleMessage(ms: IServerRequestMessage, id) {
    (this.players.find(item=>item.playerController.playerId ===id) as HumanCommander).handleClientMessage(JSON.parse(ms.content))
  }

  sendMessage(connection: connection, msg: string, date: string) {
    connection.sendUTF(JSON.stringify({ msg, date }));
  }
}