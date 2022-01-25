import { IObjectInfo, IRegisteredPlayerInfo } from "./dto";
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
    this.registeredPlayersInfo.forEach(item => {
      const allPlayers = this.registeredPlayersInfo.map(it => it.id)
      this.sendMessage(item.connection, 'startGame', JSON.stringify(allPlayers));
    })
  }
  startBuilding(data: {name:string, playerId: string}) {
    this.gameModel.startBuilding(data.playerId, data.name)
  }

  sendMessage(connection: connection, msg: string, date: string) {
    connection.sendUTF(JSON.stringify({ msg, date }));
  }
}