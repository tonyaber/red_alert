import {  IRegisteredPlayerInfo, IServerRequestMessage, IStartGameResponse } from "./dto";
import { GameModel } from "./gameModel";
import { connection } from "websocket";
import { BotCommander } from './botCommander';
import { HumanCommander } from "./humanCommander";
import { PlayerController } from "./playerController";
import { SpectatorCommander } from "./spectatorCommander";

export class GameServer {
  registeredPlayersInfo: IRegisteredPlayerInfo[] = [];

  players: (HumanCommander | BotCommander|SpectatorCommander)[] = [];
  gameModel: GameModel;
  constructor(){
    
  }

  registerPlayer(type:'bot'|'human'|'spectator', userId:string, connection:connection){
    this.registeredPlayersInfo.push({ type, id: userId, connection });
    if (this.registeredPlayersInfo.filter(item=>item.type ==='human'||item.type ==='bot').length >= 2) {
      this.startGame();
    }
  }

  startGame() {
    this.gameModel = new GameModel(this.registeredPlayersInfo);
    this.players = this.registeredPlayersInfo.map(it=> {
      const playerController = new PlayerController(it.id, this.gameModel);
      if (it.type === 'bot') {
        return new BotCommander(playerController );
      } else if (it.type === 'human') {
        return new HumanCommander(playerController, it.connection);
      } else if (it.type === 'spectator') {
        const targetId = this.registeredPlayersInfo.find(it => it.type === 'human'||it.type === 'bot').id;
        return new SpectatorCommander(playerController, it.connection, targetId);
      } else {
        throw new Error('Invalid type');
      }
    });
  //create, delete
    this.gameModel.onUpdate = (data, action)=>{
      if (action === 'update') {
         this.players.forEach(player => player.sendMessage('update', JSON.stringify(data)));
      }
      if (action === 'create') {
        this.players.forEach(player => player.sendMessage('create', JSON.stringify(data)));
      }
      if (action === 'delete') {
        this.players.forEach(player=> player.sendMessage('delete', JSON.stringify(data)));

      }     
    }
    this.gameModel.onShot = (point) => {
      this.players.forEach(player=> player.sendMessage('shot', JSON.stringify(point)));
    }
    this.gameModel.onSideUpdate = (id, data)=>{
      (this.players.filter(it => it instanceof SpectatorCommander) as SpectatorCommander[])
        .filter(it => it.targetId === id)
        .forEach(item=>item.sendMessage('updateSidePanel', data))
      this.players.find(it => it.playerController.playerId === id).sendMessage('updateSidePanel', data);
      
    }
    ///start to game, fix it later
    const allPlayers = this.registeredPlayersInfo.map(it => it.id);
    this.players.forEach(item => {
      const sidePanel = this.gameModel.getState(item.playerController.playerId);
      const type = item instanceof BotCommander ? 'bot' : item instanceof HumanCommander ? 'human' : 'spectator';
      const response:IStartGameResponse = { players: allPlayers, sidePanel, type}
      item.sendMessage('startGame', JSON.stringify(response));
      
    })
  }
 
  handleMessage(ms: IServerRequestMessage, id) {
    return (this.players.find(item=>item.playerController.playerId ===id) as HumanCommander).handleClientMessage(JSON.parse(ms.content))
  }

  sendMessage(connection: connection, msg: string, date: string) {
    connection.sendUTF(JSON.stringify({ msg, date }));
  }
}