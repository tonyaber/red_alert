import { GameServer } from "./gameServer";
export interface ISendItem {
  id: number;
  name: string;
}
export default class GamesListItem {
  private _game: GameServer;

  constructor(id: number) {
    this._game = new GameServer(id);
  }
  get game(): GameServer {
    return this._game;
  }
  getItem(): ISendItem {
    return {
      id: this.game.id,
      name: "game",
    };
  }
}
