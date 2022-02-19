import { GameServer,IGameOptions } from "./gameServer";
import { IUser } from "./serverSocket";

interface IUserGame extends IUser {
  // type: 'bot'|'human'|'spectator';
}
export interface ISendItem {
  id: number;
  credits: number;
  mapID: number;
  speed: number;
  info: string;
  users: IUserGame[];
}

export default class GamesListItem {
  private _game: GameServer;

  constructor(settings:IGameOptions) {
    this._game = new GameServer(settings);
    this._game.createGame({map:settings.mapGame});
  }
  get game(): GameServer {
    return this._game;
  }
  getItem(): ISendItem {
    // console.log('this.game.getPlayersInfo()',this.game.getPlayersInfo());
    const users = this.game.getPlayersInfo().map(x=>({
      type: x.type,
      id: x.id,
      name: x.connection.user.name,
    }))
    return {
      id: this.game.id,
      credits: this.game.settings.credits,
      mapID:   this.game.settings.mapID,
      speed:   this.game.settings.speed,
      info:    this.game.settings.info,
      users: users,
    };
  }
  unregister(id:string){
    this.game.unregisterPlayer(id);
  }
}
