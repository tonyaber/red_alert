import Control from '../../../common/control';
import { SocketModel } from '../game/socketModel';
import { ClientSocket } from '../game/clientSocket';
import { Game } from '../game/game';
import { LocalModel } from '../game/localSocketModel';
import { IClientModel } from '../game/IClientModel';
import { StartPage } from './startPage';
import { Authorization } from './authorization';
import { RoomPage } from './roomPage';
import { SoundManager } from '../game/soundManager'
import { resourceLoader, resources } from '../game/resources';
import StatisticsPage from './statisticsPage'
import {SettingsPage} from './settingsPage'
import style from './application.css'
import PopupPage from './popup'


export class Application extends Control{
  socket: IClientModel;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', style['global_main']);
    SoundManager.preload();
    this.mainCycle();
  }

  mainCycle() {
    const startPage = new StartPage(this.node);
    startPage.onSinglePlay = () => {
      startPage.destroy();
      this.socket = new LocalModel();
      this.gameCycle();
    }
    startPage.onMultiPlay = () => {
      startPage.destroy();
      const clientSocket = new ClientSocket('ws://localhost:3000/');
      this.socket = new SocketModel(clientSocket);
      this.gameCycle();      
    }
  }

  gameCycle() {
    const authorization = new Authorization(this.node, this.socket);//ответ с именем
    authorization.onAuth = (name) => {
      authorization.destroy();
      //const settings = new SettingsPage(this.node, this.socket);
      
      const roomPage = new RoomPage(this.node, this.socket);
      roomPage.onStartGame = (data) => { //при мульти ждет игроков
        roomPage.destroy();
        resourceLoader.load(resources).then(res=>{
          const game = new Game(this.node, this.socket, name, data, res.textures);
          game.onExit = () => {
            //TODO сделать выход всех игроков, оповещение
            game.destroy();
            this.finishCycle();
          } 
          game.onPause = () => {
            const pause = new PopupPage(this.node, 'Game paused ||', 'You stay game on pause. Your competitors wait you. Harry up!');
            //TODO сделать паузу для всех игроков, оповещение
            pause.onBack = () => {
              pause.destroy();
            }
          }
        })
      }
    }

    authorization.onHome = () => {
      authorization.destroy();
      this.mainCycle();
    }
  }

  finishCycle() {
    const statisticsPage = new StatisticsPage(this.node);
    //statisticsPage.animateIn();
    statisticsPage.onHome = () => {
      //statisticsPage.animateOut().then(() => {
      statisticsPage.destroy();
      this.mainCycle();
      //});
    }
  }
/*
  gameCycle_() {    
    const settingsPage = new SettingsPage(this.main.node,  this.settingsModel.getData())//, this.maps.data);
    settingsPage.onBack = () => {
      settingsPage.destroy();
      this.mainCycle();
    }
    settingsPage.onPlay = (settings) => {
      settingsPage.destroy();
     // this.settingsModel.setData(settings);
      this.loader.load(resources).then(res => { //в ресурсах есть мар??
        const game = new Game(this.main.node, res.textures, settings);
        game.onExit = () => {
          game.destroy();
          this.finishCycle();
        }
      })
    }
  }
*/



    // const startPage = new StartPage(this.main.node);
    // startPage.animateIn();
    // startPage.onGamePlay = (typeGame) => {
    //   startPage.animateOut().then(() => {
    //     startPage.destroy();
    //     this.gameCycle();
    //   });
    // }

}
