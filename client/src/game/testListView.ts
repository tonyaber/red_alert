import Control from '../common/control';
import { ClientSocketModel } from '../common/SocketClient';
import {createIdGenerator} from './idGenerator';

class ItemView extends Control{
  name: Control<HTMLElement>;
  content: Control<HTMLElement>;
  deleteButton: Control<HTMLElement>;
  onDelete: ()=>void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.name = new Control(this.node);
    this.content = new Control(this.node);
    this.deleteButton = new Control(this.node, 'button', '', 'delete');
    this.deleteButton.node.onclick = ()=>{
      this.onDelete?.();
    }
  }

  update(data:IListItem){
    this.name.node.textContent = data.name;
    this.content.node.textContent = data.content;
  }
}

export class TestListView extends Control{
  model: ITestListModel;
  list: Control<HTMLElement>;
  items: Record<string, ItemView> = {};
  constructor(parentNode: HTMLElement, model:ITestListModel) {
    super(parentNode);
    this.model = model;
    const controls = new Control(this.node);
    const addButton = new Control(controls.node, 'button', '', 'add');
    addButton.node.onclick = ()=>{
      this.model.addItem({name:Math.random().toString(), content:'content '+Math.random().toString()})
    }
    this.list = new Control(this.node);
    //this.update();
    model.onChange = (listData)=>{
      this.update(listData);
    }
    model.getList();
  }

  update(listData: IListData){
    //const listData = this.model.model.getList(); 
    Object.keys(listData).forEach(itemId=>{
      const itemData = listData[itemId];
      const itemView = this.items[itemId]
      if (itemView){
        itemView.update(itemData);
      } else {
        const newView = new ItemView(this.list.node);
        newView.onDelete = ()=>{
          this.model.removeItem(itemId);
        }
        newView.update(itemData);
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

interface IListItem{
  name:string;
  content:string;
}

type IListData = Record<string, IListItem>;

export class TestListModel{ //cache
  private data:IListData = {};
  private nextId = createIdGenerator('testlist');
  public onChange:()=>void;

  constructor() {
    
  }

  addItem(item:IListItem){
    this.data[this.nextId()] = item;
    this.onChange?.();
  }

  removeItem(id:string){
    delete this.data[id];
    this.onChange?.();
  }

  updateItem(id:string, data:IListItem){
    this.data[id] = data;
    this.onChange?.();
  }

  getItem(id:string){
    return this.data[id];
  }

  getList(){
    return {...this.data};
  }

  setList(list:IListData){
    this.data = list;
    this.onChange?.();
  }
}

interface ITestListModel{
  onChange:(listData:IListData)=>void;

  addItem:(item:IListItem)=>void;
  removeItem: (id:string)=>void;
  getList:()=>void;

}

export class TestListLocalModel implements ITestListModel{
  public onChange:(listData:IListData)=>void;
  private model: TestListModel;

  constructor(listModel:TestListModel) {
    this.model = listModel;
    this.model.onChange = ()=>{
      this.onChange(this.model.getList());
    }
  }

  addItem(item:IListItem){
    this.model.addItem(item);
    //this.data[this.nextId()] = item;
    //this.socket.sendRequest('addItem', JSON.stringify(item));
    //this.onChange?.();
  }

  removeItem(id:string){
    this.model.removeItem(id);
    //delete this.data[id];
    //this.onChange?.();
  }

  /*updateItem(id:string, data:IListItem){
    this.data[id] = data;
    //this.onChange?.();
  }

  getItem(id:string){
    return this.data[id];
  }*/

  getList(){
    let list = this.model.getList();
    this.onChange(list);
    //return {...this.data};
  }
}

export class TestListClientModel implements ITestListModel{
  //private data:IListData = {};
  //private nextId = createIdGenerator('testlist');
  //public onChange:()=>void;
  private socket: ClientSocketModel;
  private model: TestListModel;
  public onChange:(listData:IListData)=>void;

  constructor(socket: ClientSocketModel, listModel:TestListModel) {
    this.socket = socket;
    this.model = listModel;
    this.model.onChange = ()=>{
      this.onChange(this.model.getList());
    }
    this.socket.onMessage.add((response)=>{
      if (response.type == 'getList'){
        const responseData:IListData = JSON.parse(response.content);
        this.model.setList(responseData);
        //this.model.setList(responseData);
      }

      if (response.type == 'addItem'){
        const responseData:{id:string, item:IListItem} = JSON.parse(response.content);
        this.model.updateItem(responseData.id, responseData.item);
      }

      if (response.type == 'removeItem'){
        const itemId:string = JSON.parse(response.content);
        this.model.removeItem(itemId);
      }
    });
  }

  addItem(item:IListItem){
    //this.data[this.nextId()] = item;
    this.socket.sendRequest('addItem', JSON.stringify(item));
    //this.onChange?.();
  }

  removeItem(id:string){
    this.socket.sendRequest('removeItem', id);
    //delete this.data[id];
    //this.onChange?.();
  }

  /*updateItem(id:string, data:IListItem){
    this.data[id] = data;
    //this.onChange?.();
  }

  getItem(id:string){
    return this.data[id];
  }*/

  getList(){
    this.socket.sendRequest('getList', JSON.stringify({}));
    //return {...this.data};
  }
}