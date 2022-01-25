import { IObjectInfo, IRegisteredPlayerInfo, IServerRequestMessage } from "./dto";
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
  
    this.gameModel.onUpdate = (id, data)=>{
      this.players.forEach(player => player.sendMessage('update', data));
    }
    this.gameModel.onSideUpdate = (id, data)=>{
      this.players.find(it=>it.playerController.playerId === id).sendMessage('updateSidePanel', data);
    }
    
    ///start to game, fix it later
    const allPlayers = JSON.stringify(this.registeredPlayersInfo.map(it => it.id))
    this.players.forEach(item => {
      const sidePanelData = this.gameModel.getState(item.playerController.playerId);
      item.sendMessage('startGame', JSON.stringify({ players: allPlayers, sidePanelData}));
      
    })
  }
 
  handleMessage(ms: IServerRequestMessage, id) {
    (this.players.find(item=>item.playerController.playerId ===id) as HumanCommander).handleClientMessage(JSON.parse(ms.content))
  }

  sendMessage(connection: connection, msg: string, date: string) {
    connection.sendUTF(JSON.stringify({ msg, date }));
  }
}