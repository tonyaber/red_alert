import GamesListItem, { ISendItem } from "./gamesListItem";
export default class GamesList {
  private _list: GamesListItem[] = [];
  createGame() {
    this._list.push(new GamesListItem(this._list.length));
    return this.get(this._list.length - 1);
  }
  get(id: number): GamesListItem {
    return this._list[id];
  }
  getList():ISendItem[]{
    return this._list.map(x=>x.getItem());
  }
}
// const gamesList = new GamesList();

