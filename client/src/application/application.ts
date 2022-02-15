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
import {SettingsPage} from './settingsPageSingle'
import { Settings } from './settingsPageMulti';
import style from './application.css'
import PopupPage from './popup'
import InfoPage from './infoPage'
import { getImageData, getMapFromImageData } from '../game/tracer';


export class Application extends Control{
  socket: IClientModel;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', style['global_main']);
    SoundManager.preload();
    this.mainCycle();
  }

  mainCycle() {
    resourceLoader.load(resources).then(res => {
      
      const startPage = new StartPage(this.node);
      startPage.onSinglePlay = () => {
        startPage.destroy();
        this.socket = new LocalModel();
        //this.gameCycle();
        this.singleCycle(res.textures);
      }
      startPage.onMultiPlay = () => {
        startPage.destroy();
        const clientSocket = new ClientSocket('ws://localhost:3000/');
        this.socket = new SocketModel(clientSocket);
        this.multiCycle(res.textures);      
      }
    })
    
  }

  
  singleCycle(res: Record<string, HTMLImageElement>){
    const settings = new SettingsPage(this.node, this.socket);
    settings.onPlay = (set) => { // передаем set параметры для настройки игры
      const imageData = getImageData(res.map)
      const mapGame = getMapFromImageData(imageData);
      this.socket.createMap(mapGame);
      const info = new InfoPage(this.node, this.socket);
      info.onStartGame = (data) => {
        settings.destroy();
        info.destroy();
        this.gameCycle(settings.nameUser, data, res)
      }
    }
  }

  multiCycle(res: Record<string, HTMLImageElement>) {
    const authorization = new Authorization(this.node, this.socket);//ответ с именем
    authorization.onAuth = (name) => {
      authorization.destroy();
      //const settings = new SettingsPage(this.node, this.socket);
      const roomPage = new RoomPage(this.node, this.socket);
      const imageData = getImageData(res.map)
      const mapGame = getMapFromImageData(imageData);
      this.socket.createMap(mapGame);
      roomPage.onCreateGame = () => {
        const settings = new Settings(this.node);
        settings.onCreate = (data) => {
          //записываем данные созданной игры 
          this.socket.chatSend({user: 'system', msg: `new game create`}); //добавить название карты/игры
          settings.destroy();
        }
      }
      roomPage.onStartGame = (data) => { //при мульти ждет игроков
        roomPage.destroy();
        this.gameCycle(name, data, res)
      }
    }
    authorization.onHome = () => {
      authorization.destroy();
      this.mainCycle();
    }
  }

  gameCycle(name:string, data:any, res: Record<string, HTMLImageElement>){  ///TODO type??

      const game = new Game(this.node, this.socket, name, data, res);
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
}
