import Control from "../common/control";
import {Game} from '../game/game';
import {ClientSocketModel} from "../common/SocketClient";
import {IObject} from "../game/dto";
import {Vector} from "../common/vector";
import { GameObject } from "../game/gameModel";

export class Application extends Control {
  private clientSocketModel: ClientSocketModel
  private game: Game;

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

    const startPage = new StartPage(this.node)
    startPage.onStartPageClick = async (name) => {
      this.send()
      startPage.destroy()

      //рисуем страницу с настройками
      //когда подключается 2 игрока - открываем страницу с игрой
      //передать все имена и имя нашего игрока в гейм
      //создать по списку модели плееров
      this.game = new Game(this.node);
      this.game.sendBuildData = (obj, position) => {
        this.sendNewBuild(obj, position)
      }
      this.game.updateObject = (data: string) => {
        this.sendUpdateObject(data);
      }
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