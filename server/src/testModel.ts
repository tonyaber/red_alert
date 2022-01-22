import { IServerRequestMessage, IServerResponseMessage } from "./serverInterfaces";
import {connection} from "websocket";

interface IListItem{
  name:string;
  content:string;
}

type IListData = Record<string, IListItem>;

function createIdGenerator(prefix: string) {
  let counter = 0;
  return () => {
    return prefix + counter++;
  }
}

export class TestListModel{
  private data:IListData = {};
  private nextId = createIdGenerator('testlist');
  public onChange:()=>void;

  constructor() {
    
  }

  addItem(item:IListItem):string{
    const id = this.nextId();
    this.data[id] = item;
    this.onChange?.();
    return id;
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
        content: JSON.stringify({id, item:requestData})
      });
    }
    if (message.type == 'updateItem'){
      const requestData:{id: string, item: IListItem} = JSON.parse(message.content);
      this.model.updateItem(requestData.id, requestData.item);
      this.sendResponse({
        type: 'updateItem',
        content: JSON.stringify({id: requestData.id, item:requestData.item})
      });
    }

    if (message.type == 'removeItem'){
      const requestData: string = message.content;
      this.model.removeItem(requestData);
      this.sendResponse({
        type: 'removeItem',
        content: JSON.stringify(requestData)
      });
    }

    if (message.type == 'getList'){
      const list = this.model.getList();
      connection.sendUTF(JSON.stringify({
        type: 'getList',
        content: JSON.stringify(list)
      }));
    }
  }
}