import Control from "../common/control";
import {Game} from '../game/game';
import {ClientSocketModel} from "../common/SocketClient";
import {IObject} from "../game/dto";
import {Vector} from "../common/vector";

export class Application extends Control {
  private clientSocketModel: ClientSocketModel
  private game: Game;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.clientSocketModel = new ClientSocketModel()
    this.clientSocketModel.getNewBuild=(data)=>{
      this.game.getNewBuild(data)
    }
    console.log(this.clientSocketModel)

    const startPage = new StartPage(this.node)
    startPage.onStartPageClick = async (name) => {
      this.send()
      startPage.destroy()
      this.game = new Game(this.node);
      this.game.sendBuildData = (obj, position) => {
        this.sendNewBuild(obj, position)
      }
    }

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
    const button = new Control(this.node, 'button')
    button.node.onclick = () => {
      //this.clientSocketModel.setPlayerName()
      this.onStartPageClick(input.node.value)
    }
  }

}