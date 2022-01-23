import {IVector, Vector} from '../common/vector';
import {InteractiveTile} from './interactiveTile';
import {IListClient, IListData, ListModel, ListSocketClient} from './list';
import {IObject, ITickable} from "./dto";
import Signal from "../common/signal";
import {GamePlayer, MapInfo} from "./gameModel";
import {createIdGenerator} from "./idGenerator";
import {SocketClient} from "../common/SocketClient1";
import { GameCanvas } from './gameCanvas';

export class GameModel implements ITickable{
  objectList: GameObjectList;
  mapInfo: MapInfo;
  player: GamePlayer;
  onUpdateSidePanel: Signal<void> = new Signal();
  onUpdateCanvas: Signal<void> = new Signal();
  updateModel: (data: string) => void;
  players: GamePlayer[] = [];

  //onBuild: (build: IObjectInfo) => void;
  private listSocketModelClient: ListSocketClient<IListItem>;
  private listModel: ListModel<IListItem>;
  constructor(players: string[], name: string, socket: SocketClient) {

    //this.objectList = new GameObjectList();

    this.listModel = new ListModel<IListItem>(createIdGenerator('objectId'))
    this.listSocketModelClient = new ListSocketClient<IListItem>(socket, this.listModel)
    this.objectList = new GameObjectList(this.listSocketModelClient);
    this.objectList.onUpdate = (items=>{
      this.player.update(items);
    });

    this.mapInfo = new MapInfo();
    players.forEach((item) => {
      const player = new GamePlayer(item);
      this.players.push(player);
    })
    console.log(this.players, name);
    this.player = this.players.find(item => item.id === name);
    //this.player = new GamePlayer();
    this.player.onUpdatePlayer = () => {
      this.onUpdateSidePanel.emit();
    }
  }

 tick(delta: number) {
     this.player.tick(delta);
   // this.objectList.tick(delta);
   }

  //создать массив вскх игроков GamePlayer, наш игрок будет в this.player
  addBuild(data: { object: IObject, playerName: string, position: Vector }) {
    this.listSocketModelClient.addItem({
      position: data.position,
      health: 100,
      type: data.object.object.name,
      player: data.playerName,
    });
    // if (data.playerName === this.player.id) {
    //   this.player.buildsInGame.push(data.object.object);
    //   this.player.getAvailableObject();
    //   const obj = this.player.allObject.find(item => item.object.name === data.object.object.name);
    //   obj.status = 'Available';
    //   obj.progress = 0;
    //   this.onUpdateSidePanel.emit();
    // }
    //
    // //obj.status = 'Available';
    // //obj.progress = 0;
    // console.log(data)
    // const player = this.players.find(item => item.id === data.playerName);
    // const newObject = new GameObject1(data.object.object, player, new Vector(data.position.x, data.position.y));
    // newObject.onObjectUpdate = () => {
    //   this.updateModel(newObject.toJSON())
    // }
    // this.objectList.add(newObject);
  }
}

export interface IListItem {
  player: string;
  position: IVector;
  type: string;
  //content: string; 
  health: number;

}

export class ItemView {
  node: InteractiveTile;
  data: IListItem;
  onDelete: () => void;

  constructor() {

  }

  update(data: IListItem, id: string) {

  }

  destroy() {

  }

}

export class GameObjectView extends ItemView {
  node: InteractiveTile;
  data: IListItem;

  //onObjectUpdate: () => void;
  constructor(/*object: IObjectInfo, player: GamePlayer, position: Vector*/) {
    super()
    // this.name = object.name;
    // this.health = 100;
    // this.type = object.type;
    // this.bullet = 10;
    // this.player = player;
    // this.position = position.clone();
    this.node = new InteractiveTile();
    //this.node.gameObject = this;
    //this.node.position = position.clone();
    //this.node.health = this.health;
  }

  update(data: IListItem, id: string) {
    this.data = data;
    //this.node.gameObject = this;
    this.node.position = Vector.fromIVector(data.position);
    //this.health = data.health;
    this.node.health = data.health;
    this.node.id = id;
  }
}

export class GameObjectList {
  private model: IListClient<IListItem>;
  items: Record<string, ItemView> = {};
  onUpdate: (items: Record<string, ItemView>)=>void;

  constructor(model: IListClient<IListItem>) {
    this.model = model;

    model.onChange = (listData: IListData<IListItem>) => {
      this.update(listData);
    }
    model.getList();
  }

  private update(listData: IListData<IListItem>) {
    //const listData = this.model.model.getList(); 
    Object.keys(listData).forEach(itemId => {
      const itemData = listData[itemId];
      const itemView = this.items[itemId]
      if (itemView) {
        itemView.update(itemData, itemId);
      }
      else {
        //const newView = new ItemView();
        const newView = new GameObjectView();
        newView.onDelete = () => {
          this.model.removeItem(itemId);
        }
        newView.update(itemData, itemId);
        this.items[itemId] = newView;
      }
    });
    Object.keys(this.items).forEach(viewId => {
      if (!listData[viewId]) {
        this.items[viewId].destroy();
      }
    });
    this.onUpdate(this.items);
  }
}