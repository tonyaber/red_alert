import { IConnection, IServerRequestMessage, IServerResponseMessage } from "./serverInterfaces";
import { connection } from "websocket";
import { TickList } from './tickList';

interface IListItem{
  name:string;
  content:string;
  type: string;
}

type IListData = Record<string, IListItem>;

function createIdGenerator(prefix: string) {
  let counter = 0;
  return () => {
    return prefix + counter++;
  }
}

class AbstractClass {
  onDestroy: () => void;
  onUpdate: () => void;
 update(data:IListItem) {
    
  }

  tick(delta: number) {
    
  }
}
class class1 extends AbstractClass{
  data: IListItem;
  constructor(data: IListItem) {
    super();
    this.data = data;
  }
}

class class2 extends AbstractClass{
  data: IListItem;
  health: 100;
  onDestroy: () => void;
  onUpdate: () => void;
  constructor(data: IListItem) {
    super();
    this.data = data;
  }

  tick(delta: number) {
    this.health -= 10;
    this.onUpdate();
    if (this.health <= 0) {
      this.onDestroy();
    }
  }
}

class class3 extends AbstractClass{
 data: IListItem;
  constructor(data: IListItem) {
    super();
    this.data = data;
  }
 
}
const map = new Map([['add1',  class1],['add2', class2], ['add3', class3]]);
class Player{
  connection: connection;
  name: string;
  data: Record<string, AbstractClass>;
  tickList: any;
  sendPublicResponse: (date: AbstractClass, id: string) => void;
 // sendPrivateResponse: () => void;
  constructor(connection: connection, name: string) {
    this.connection = connection;
    this.name = name;
  }

  addItem(item: IListItem, id: string) {
    if (Math.random() > 0.5) {//false
      this.sendPrivateResponse();
    } else {
    const newClass = map.get(item.type);
    this.data[id] = new newClass(item);
      this.tickList.add(this.data[id]);
      this.data[id].onUpdate = () => {
      this.sendPrivateResponse();
       this.sendPublicResponse(this.data[id] ,id) 
      }
      this.data[id].onDestroy = () => {
        this.sendPrivateResponse();
        this.sendPublicResponse(this.data[id], id);
      }
    }
  }

  tick(delta: number) {
    Object.values(this.data).forEach(item => item.tick(delta));
  }
  sendPrivateResponse() {
    
  }
}

class Bot extends Player{
  constructor(connection: connection, name: string) {
    super(connection, name);
  }
  tick(delta: number) {
      Object.values(this.data).forEach(item => item.tick(delta));
  }
}

class Controller{
  users: Player[] = [];
  tickList: TickList;
  sendPublicResponse: (data: AbstractClass, connection: connection, id: string) => void;
  constructor() {
  }
  addUser(connection: connection, name: string) {
    if (name.includes('bot')) {
      const user = new Bot(connection, name);
      user.sendPublicResponse = (data: AbstractClass, id: string) => {
        this.sendPublicResponse(data, user.connection, id);
      }
      // user.sendPrivateResponse = () => {
      //   this.sendPrivateResponse();
      // }
      this.users.push(user);
    } else {
      const user = new Player(connection, name);
      user.sendPublicResponse = (data: AbstractClass, id: string) => {
        this.sendPublicResponse(data, user.connection, id);
      }
      // user.sendPrivateResponse = () => {
      //   this.sendPrivateResponse();
      // }
      this.users.push(user);
    }
  }
  addItem(item: IListItem, id: string, userConnection: connection) {
    this.users.find(item=>item.connection ===userConnection).addItem(item, id)
  }

  tick(delta: number) {
    this.users.forEach(item => item.tick(delta))
  }

  sendPrivateResponse() {
    
  }

}
 

export class TestListModel{
  private data:Record<string, AbstractClass> = {};
  private nextId = createIdGenerator('testlist');
  public onChange: () => void;
  
  users: connection[] = [];
  //users: {connection:{sendUTF:(msg:string)=>void}}[];
  tickList: TickList;
  controller: Controller;

  constructor() {
    this.tickList = new TickList()
    this.controller = new Controller();
    this.controller.sendPublicResponse = (data: AbstractClass, user: connection, id: string) => {
      this.data[id] = data;
      this.sendPublic(JSON.stringify(this.data));
    }
    this.tickList.add(this.controller);
  }

  addUser(user: connection, name: string/*user: {connection:{sendUTF:(msg:string)=>void}}*/){
    //this.users.push(user);
    this.users.push(user);
    this.controller.addUser(user, name)
  }

  sendPublic(msg){
    this.users.forEach(user=>user.sendUTF(msg));
  }

  // sendPrivate(user, msg){
  //   user.sendUTF(msg);
  // }

  addItem(item:IListItem, userConnection: connection):string{
    const id = this.nextId();
    this.controller.addItem(item, id, userConnection);
    // const newClass = map.get(item.type);
    // this.data[id] = new newClass(item);
    // this.tickList.add(this.data[id]);
    //this.onChange?.();

    //  this.sendResponse({
    //     type: 'addItem',
    //     requestId: message.requestId,
    //     content: JSON.stringify({id, item:requestData})
    //   });
    //   this.sendPrivate(connection, {
    //     type: 'addItemPrivate',
    //     requestId: message.requestId,
    //     content: JSON.stringify({id, item:requestData})
    //   });
    //this.sendPrivate(user, )
    //this.sendPublic();
    return id;
  }

  removeItem(id: string) {
    this.tickList.remove(this.data[id]);
    delete this.data[id];
    this.onChange?.();
  }

  updateItem( data:IListItem,id:string){
    this.data[id].update(data);
    this.onChange?.();
  }

  getItem(id:string){
    return this.data[id];
  }

  getList(){
    return {...this.data};
  }
}

export class TestListSocket{
  model: TestListModel;
  sendResponse: (message: IServerResponseMessage) => void;

  constructor(model:TestListModel, sendResponse: (message:IServerResponseMessage)=>void){
    this.model = model;
    this.model.onChange = ()=>{
      console.log(this.model.getList());
    }
    this.sendResponse = sendResponse;
  }

  handleMessage(connection: connection, message: IServerRequestMessage) {
    if (message.type === 'sendName') {
      this.model.addUser(connection, message.content);
    }
    if (message.type == 'addItem'){
      const requestData: IListItem = JSON.parse(message.content);
      const id = this.model.addItem(requestData, connection);
      // this.sendResponse({
      //   type: 'addItem',
      //   requestId: message.requestId,
      //   content: JSON.stringify({id, item:requestData})
      // });
      // this.sendPrivate(connection, {
      //   type: 'addItemPrivate',
      //   requestId: message.requestId,
      //   content: JSON.stringify({id, item:requestData})
      // });
    }
    if (message.type == 'updateItem'){
      const requestData:{id: string, item: IListItem} = JSON.parse(message.content);
      //this.model.updateItem(requestData.id, requestData.item);
      this.sendResponse({
        type: 'updateItem',
        requestId: message.requestId,
        content: JSON.stringify({id: requestData.id, item:requestData.item})
      });
      this.sendPrivate(connection, {
        type: 'updateItemPrivate',
        requestId: message.requestId,
        content: JSON.stringify({id: requestData.id, item:requestData.item})
      });
    }

    if (message.type == 'removeItem'){
      const requestData: string = message.content;
      this.model.removeItem(requestData);
      this.sendResponse({
        type: 'removeItem',
        requestId: message.requestId,
        content: JSON.stringify(requestData)
      });
      this.sendPrivate(connection, {
        type: 'removeItemPrivate',
        requestId: message.requestId,
        content: JSON.stringify(requestData)
      });
    }

    if (message.type == 'getList'){
      const list = this.model.getList();
      this.sendPrivate(connection, {
        type: 'getListPrivate',
        requestId: message.requestId,
        content: JSON.stringify(list)
      });
    }
  }

  sendPrivate(connection, response:IServerResponseMessage){
    connection.sendUTF(JSON.stringify(response));
  }
  sendPublic(users:connection[], response: IServerResponseMessage) {
    users.forEach(connection => {
      connection.sendUTF(JSON.stringify(response));
    })
  }
}