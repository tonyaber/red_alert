import { GamePlayer } from './gameModel';
import { InteractiveObject } from './interactiveObject';
import { IObjectInfo } from './dto';
import { IVector, Vector } from '../common/vector';
import { InteractiveTile } from './interactiveTile';
import { IListClient, IListData} from './list';

class GameObjectList{
  list: GameObject[] = [];

  add(object:GameObject) {   
    this.list.push(object);
  }

  tick(delta: number) {
    this.list.forEach(item => item.tick(delta));
  }
}

export class GameObject{
  name: string;
  health: number;
  type: "unit" | "build";
  bullet?: number;
  player: GamePlayer;
  position: Vector;
  node: InteractiveObject;
  id: string;
  onObjectUpdate: () => void;
  constructor(object: IObjectInfo, player: GamePlayer, position:Vector) {
    this.name = object.name;
    this.health= 100;
    this.type = object.type;
    this.bullet = 10;
    this.player = player;
    this.position = position.clone();
    //this.id = globalGameInfo.nextId();
    //this.node = new InteractiveObject();   
    //this.node.position = position.clone();
  }

  tick(delta: number) {
    
  }

  toJSON() {
    
  }

  fromJSON(data: string) {
    
  }
  
}

class GameObject1 extends GameObject{
  node: InteractiveTile;
  
  constructor(object: IObjectInfo, player: GamePlayer, position:Vector) {
    super(object, player, position);
    this.node = new InteractiveTile();  
    this.node.gameObject = this;
    this.node.position = position.clone();
    this.node.health = this.health;
  }

  tick(delta: number) {
   // this.health -= delta * 0.001;
    //this.node.health = this.health;
    //this.onObjectUpdate()
  }


  
  toJSON() {
    return JSON.stringify({ position: this.position, health: this.health, id: this.id});
  }

  fromJSON(data: string) {
    const newData = JSON.parse(data);
    this.health = newData.health;
    this.node.health = this.health;
  }
}

export interface IListItem{
  player: string;
  position: IVector;
  type: string;
  //content: string; 
  health: number;
  
}

export class ItemView{
  onDelete: () => void;
  constructor() {
    
  }

  update(data: IListItem, id: string) {
    
  }
  destroy() {
    
  }

}

export class GameObjectView extends ItemView{ 
  node: InteractiveTile;
  
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
  update(data: IListItem, id: string ) {
    //this.node.gameObject = this;
    this.node.position = Vector.fromIVector(data.position);
    //this.health = data.health;
    this.node.health = data.health;
    this.node.id = id; 
  }
}

export class TestListView1 {
  model: IListClient<IListItem>;
  items: Record<string, ItemView> = {};
  constructor( model:IListClient<IListItem>) {
    this.model = model;
    
    //const controls = new Control(this.node);
    //const addButton = new Control(controls.node, 'button', '', 'add');
    // addButton.node.onclick = ()=>{
    //   this.model.addItem({name:Math.random().toString(), content:'content '+Math.random().toString()})
    // }
    // this.list = new Control(this.node);
    //this.update();
    model.onChange = (listData: IListData<IListItem>)=>{
      this.update(listData);
    }
    model.getList();
  }

  update(listData: IListData<IListItem>){
    //const listData = this.model.model.getList(); 
    Object.keys(listData).forEach(itemId=>{
      const itemData = listData[itemId];
      const itemView = this.items[itemId]
      if (itemView){
        itemView.update(itemData, itemId);
      } else {
        //const newView = new ItemView();
        const newView = new GameObjectView();
        newView.onDelete = ()=>{
          this.model.removeItem(itemId);
        }
        newView.update(itemData, itemId);
        this.items[itemId] = newView;
      }
    });
    Object.keys(this.items).forEach(viewId=>{
      if (!listData[viewId]){
        this.items[viewId].destroy();
      }
    })
  }
}