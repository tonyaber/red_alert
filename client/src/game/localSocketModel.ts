import { BotCommander } from "../../../server/src/botCommander";
import { IRegisteredPlayerInfo } from "../../../server/src/dto";
import { GameModel } from "../../../server/src/gameModel";
import { PlayerController } from "../../../server/src/playerController";
import { IChatMsg, IGameUpdateResponse } from './dto';
import { IGameObjectData, IObjectInfo } from "./dto";
import { IClientModel } from './IClientModel'
import {Vector} from '../../../common/vector'

export class LocalModel implements IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateResponse) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  onUpdate: (data: IGameObjectData) => void;
  onAddObject: (data: IGameObjectData) => void;
  onDeleteObject: (data: IGameObjectData) => void;
  onShot: (point: Vector) => void;
  onChatMsg: (msg: IChatMsg) => void;
  myPlayer: PlayerController;
  player: string;
  game: GameModel;

  constructor(){

  }

  addUser() {
    this.player = 'user' + Math.floor(Math.random() * 100);
    const bots: IRegisteredPlayerInfo[] = new Array(2).fill(null).map(item => {
      return {
        id: 'bot' + Math.floor(Math.random() * 100),
        type: 'bot'
      }
    });
    this.onAuth(this.player);
    this.startGame(bots);
  }

  startGame(playersInfo: IRegisteredPlayerInfo[]){
    
    const gamePlayersInfo = playersInfo.slice();
    gamePlayersInfo.push({
      id: this.player,
      type: 'human'
    });
    const game = new GameModel(gamePlayersInfo);
    const myPlayerController: PlayerController = new PlayerController(this.player, game);
    this.myPlayer = myPlayerController;
    const bots = playersInfo.map(it=> {
      const playerController = new PlayerController(it.id, game);
      return new BotCommander(playerController);
    });
    game.onUpdate = (data, action) => {
    //   bots.forEach(player=> player.sendMessage({}));
      if (action === 'update') {
        this.onUpdate(data);
      }
      if (action === 'create') {
        this.onAddObject(data);
      }
      if (action === 'delete') {
        this.onDeleteObject(data);
      }
    }
    game.onShot = (point) => {
      this.onShot(point);
    }

    // game.onUpdate = (id, data)=>{
    //   bots.forEach(player=> player.sendMessage({}));
    //   //this.onCanvasObjectUpdate();
    // }
    game.onSideUpdate = (id, data)=>{
     // bots.find(it=>it).sendMessage(data);
      if (id === this.player) {
        this.onSideUpdate(JSON.parse(data));
      } else {
        bots.find(item => item.playerController.playerId === id).sendMessage('updateSidePanel',data);
      }
    }

    const allPlayers =playersInfo.map(it => it.id);
    allPlayers.push(this.player);
    const sidePanel = game.getState(myPlayerController.playerId);
    this.onStartGame(JSON.stringify({ players: allPlayers, sidePanel, type:'human' }));
    bots.forEach(item => {       
      const sidePanel = game.getState(item.playerController.playerId);      
      item.sendMessage('startGame', JSON.stringify({ players: allPlayers, sidePanel, type: 'bot' }))
      
    })
    this.game = game;
  }

  //side

  startBuild(name: string, playerId: string):Promise<string> {
    const result = this.myPlayer.startBuilding(name);
    return new Promise(resolve => resolve(result));
  }

  pauseBuilding(name: string, playerId: string):Promise<string>{
    const result = this.myPlayer.pauseBuilding(name);
    return new Promise(resolve => resolve(result))
  }

  playBuilding(name: string, playerId: string):Promise<string>{
    const result = this.myPlayer.playBuilding(name);
    return new Promise(resolve => resolve(result))
  }

  cancelBuild(){
  }
  registerGamePlayer() {
  }
  registerSpectator() {
  
  }

  chatSend():Promise<string>{ return new Promise((r)=>r(''))}

  //to map
  addBuild(name: string, position: Vector, playerId: string):Promise<string>{
    const result = this.myPlayer.addGameObject(name, position);
    return new Promise(resolve => resolve(result))
  }
  addInitialDate(name: string, position: Vector, playerId: string):Promise<string>{
    const result = this.game.addGameObject(playerId,name, position);
    return new Promise(resolve => resolve(result))
  }

  setPrimary(id: string, name: string):Promise<string>{
    const result = this.myPlayer.setPrimary(id, name);
    return new Promise(resolve => resolve(result))
  }

  moveUnit(id: string, position: Vector,tileSize:number): Promise<string>{
    console.log('TILESIZE',tileSize)

    const result =  this.myPlayer.moveUnits(id, position,tileSize);
    return new Promise(resolve => resolve(result));
  }

  setAttackTarget(id: string, targetId: string,tileSize:number):Promise<string>{
    const result = this.myPlayer.setAttackTarget(id, targetId,tileSize);// , tileSize
    return new Promise(resolve => resolve(result));
  }

}