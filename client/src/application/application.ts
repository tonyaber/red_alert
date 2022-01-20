import Control from "../common/control";
import {Game} from '../game/game';
import {ClientSocketModel} from "../common/SocketClient";
import {IObject} from "../game/dto";
import {Vector} from "../common/vector";
import { GameObject } from "../game/gameModel";

export class Application extends Control {
  private clientSocketModel: ClientSocketModel
  private game: Game;
  name: string;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.clientSocketModel = new ClientSocketModel()
    this.clientSocketModel.getNewBuild=(data)=>{
      this.game.getNewBuild(data)
    }
    this.clientSocketModel.getUpdateObject = (data) => {
      this.game.setNewObject(data);
      console.log('response from server', data)
    }
    this.clientSocketModel.getName = (data) => {
      this.name = data;
      console.log(this.name)
    }
    this.clientSocketModel.startGame = (data) => {
      const players = JSON.parse(JSON.stringify(data));
      this.game = new Game(this.node, players, this.name );
        this.game.sendBuildData = (obj, position) => {
          this.sendNewBuild(obj, position)
        }
        this.game.updateObject = (data: string) => {
          this.sendUpdateObject(data);
        }
    }

    const startPage = new StartPage(this.node)
    startPage.onStartPageClick = async (name) => {
      this.send()
      startPage.destroy();
      const settingPage = new Setting(this.node);
      
      //рисуем страницу с настройками
      //когда подключается 2 игрока - открываем страницу с игрой
      //передать все имена и имя нашего игрока в гейм
      //создать по списку модели плееров
    }

  }
  sendUpdateObject(data: string) {
    this.clientSocketModel.sendUpdateObject(data)
  }

  sendNewBuild(obj: IObject, position: Vector) {
    this.clientSocketModel.addNewBuild(obj, position)
  }

  send() {
    this.clientSocketModel.setPlayerName()
  }

  
}

class StartPage extends Control {
  public onStartPageClick: (name: string) => void

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const input = new Control<HTMLInputElement>(this.node, 'input')
    const button = new Control(this.node, 'button', '', 'Start')
    button.node.onclick = () => {
      //this.clientSocketModel.setPlayerName()
      this.onStartPageClick(input.node.value)
    }
  }

}

class Setting extends Control {
  public onSettingPageClick: () => void

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const setting = new Control(this.node, 'button', '', 'Setting')
    
  }

}