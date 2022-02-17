import { GameServer,IGameOptions } from "./gameServer";
import { IUser } from "./serverSocket";
export interface ISendItem {
  id: number;
  credits: number;
  mapID: number;
  speed: number;
  info: string;
  users: IUser[];
}

export default class GamesListItem {
  private _game: GameServer;

  constructor(settings:IGameOptions) {
    this._game = new GameServer(settings);
  }
  get game(): GameServer {
    return this._game;
  }
  getItem(): ISendItem {
    
    return {
      id: this.game.id,
      credits: this.game.settings.credits,
      mapID:   this.game.settings.mapID,
      speed:   this.game.settings.speed,
      info:    this.game.settings.info,
      users: [
        {id:"***", name:'fake1'},
        {id:"**1", name:'fake2'},
      ],
    };
  }
}
