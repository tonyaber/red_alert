import { GameServer } from "./gameServer";

export default class GamesListItem {
    private _game:GameServer;

    constructor(id:number){
      this._game = new GameServer(id);       
    }
    get game():GameServer{ return this._game };
}