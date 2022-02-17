import {  IRegisteredPlayerInfo, IServerRequestMessage, IStartGameResponse } from "./dto";
import { GameModel } from "./gameModel";
import { connection } from "websocket";
import { BotCommander } from './botCommander';
import { HumanCommander } from "./humanCommander";
import { PlayerController } from "./playerController";
import { SpectatorCommander } from "./spectatorCommander";
import { Session } from "./serverSocket";
import { INITIAL_DATA } from './initialData';

export interface IGameOptions {
  id: number;
  credits: number;
  mapID: number;
  speed: number;
  info: string;
}

export class GameServer {
  registeredPlayersInfo: IRegisteredPlayerInfo[] = [];

  players: (HumanCommander | BotCommander|SpectatorCommander)[] = [];
  gameModel: GameModel;
  map: number[][] =[];  
  private _settings:IGameOptions; 
  constructor(props:IGameOptions){
    this._settings = props;
  }
  get id(){ return this._settings.id };
  get settings(){ return this._settings };
  getPlayersInfo():IRegisteredPlayerInfo[]{ return this.registeredPlayersInfo };
  
  registerPlayer(type:'bot'|'human'|'spectator', userId:string, connection:Session){
    if(this.registeredPlayersInfo.find((x)=>x.id===userId)){
      return {successfully:false};
    } else {
      this.registeredPlayersInfo.push({ type, id: userId, connection });
      if (this.registeredPlayersInfo.filter(item=>item.type ==='human'||item.type ==='bot').length >= 2) {
        this.startGame();
      }
      return {successfully:true};
    }
  }
  
  unregisterPlayer(userId:string){
    const user = this.registeredPlayersInfo.find((x)=>x.id===userId)
    if(user){
      const index = this.registeredPlayersInfo.indexOf(user);
      this.registeredPlayersInfo.splice(index,1);
      return {successfully:true};
    } else {
      return {successfully:false};
    }
  }

  startGame() {
    this.gameModel = new GameModel(this.registeredPlayersInfo, {map: this.map, builds: INITIAL_DATA} );
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
    this.gameModel.onShot = (point, id) => {
      this.players.forEach(player=> player.sendMessage('shot', JSON.stringify({position: point, id: id})));
    }
    this.gameModel.onSideUpdate = (id, data)=>{
      (this.players.filter(it => it instanceof SpectatorCommander) as SpectatorCommander[])
        .filter(it => it.targetId === id)
        .forEach(item=>item.sendMessage('updateSidePanel', data))
      this.players.find(it => it.playerController.playerId === id).sendMessage('updateSidePanel', data);
      
    }

    this.gameModel.onMoveBullet = (point, id) => {
     this.players.forEach(player=> player.sendMessage('moveBullet', JSON.stringify({position: point, id: id})));
    }
   
    ///start to game, fix it later
    const allPlayers = this.registeredPlayersInfo.map(it => it.id);
    this.players.forEach(item => {
      const sidePanel = this.gameModel.getState(item.playerController.playerId);
      const type = item instanceof BotCommander ? 'bot' : item instanceof HumanCommander ? 'human' : 'spectator';
      const response: IStartGameResponse = { players: allPlayers, sidePanel, type}

      item.sendMessage('startGame', JSON.stringify(response));
      
    })
    
    this.gameModel.init();
  
  }

  createGame(data:{map:number[][] } ) {   
    this.map = data.map;
    
   // this.gameModel.createMap()
  }
 
  handleMessage(ms: IServerRequestMessage, id:string) {
    return (this.players.find(item=>item.playerController.playerId ===id) as HumanCommander).handleClientMessage(JSON.parse(ms.content))
  }

  sendMessage(connection: connection, msg: string, data: string) {
    connection.sendUTF(JSON.stringify({ msg, data }));
  }
}