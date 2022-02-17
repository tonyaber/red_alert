import GamesListItem, { ISendItem } from "./gamesListItem";
import {IGameOptions} from './gameServer'

type ICreateGameOptions = Omit<IGameOptions,'id'>
export default class GamesList {
  private _list: GamesListItem[] = [];
  createGame(settings:ICreateGameOptions) {
    const id:number = this._list.length;
    const s:IGameOptions = {...settings,id:id}
    this._list.push(new GamesListItem(s));
    return this.get(id);
  }
  get(id: number): GamesListItem {
    return this._list[id];
  }
  has(id: number): boolean {
    return this._list[id]!==undefined;
  }
  getList():ISendItem[]{
    return this._list.map(x=>x.getItem());
  }
  unregisterAll(id:string):void{
    this._list.map(x=>x.unregister(id));
  }
}
// const gamesList = new GamesList();

