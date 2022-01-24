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
  constructor(data: IListItem) {
    super();
    this.data = data;
  }

  tick(delta: number) {
      
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


export class TestListModel{
  private data:Record<string, AbstractClass> = {};
  private nextId = createIdGenerator('testlist');
  public onChange: () => void;
  
  users: {connection:{sendUTF:(msg:string)=>void}}[];
  tickList: TickList;

  constructor() {
    this.tickList = new TickList()
  }

  addUser(user: {connection:{sendUTF:(msg:string)=>void}}){
    this.users.push(user);
  }

  sendPublic(msg){
    this.users.forEach(user=>user.connection.sendUTF(msg));
  }

  sendPrivate(user, msg){
    user.sendUTF(msg);
  }

  addItem(/*user*/item:IListItem):string{
    const id = this.nextId();
    const newClass = map.get(item.type);
    this.data[id] = new newClass(item);
    this.tickList.add(this.data[id]);
    this.onChange?.();

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

  updateItem(id:string, data:IListItem){
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

  handleMessage(connection:connection, message:IServerRequestMessage){
    if (message.type == 'addItem'){
      const requestData: IListItem = JSON.parse(message.content);
      const id = this.model.addItem(requestData);
      this.sendResponse({
        type: 'addItem',
        requestId: message.requestId,
        content: JSON.stringify({id, item:requestData})
      });
      this.sendPrivate(connection, {
        type: 'addItemPrivate',
        requestId: message.requestId,
        content: JSON.stringify({id, item:requestData})
      });
    }
    if (message.type == 'updateItem'){
      const requestData:{id: string, item: IListItem} = JSON.parse(message.content);
      this.model.updateItem(requestData.id, requestData.item);
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
}