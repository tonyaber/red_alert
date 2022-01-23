import { IServerRequestMessage } from "../../../server/src/serverInterfaces";
import { SocketClient } from "../common/SocketClient1";
export type IListData<ItemType> = Record<string, ItemType>;


export interface IListClient<ItemType>{
  onChange:(listData:IListData<ItemType>)=>void;
  addItem:(item:ItemType)=>Promise<IServerRequestMessage>;
  removeItem: (id:string)=>void;
  getList:()=>void;

}

export class ListModel<ItemType>{ //cache
  private data:IListData<ItemType> = {};
  private nextId: () => string;
  public onChange:()=>void;

  constructor(nextIdGenerator: ()=>string) {
    this.nextId = nextIdGenerator;
  }

  addItem(item: ItemType) {
    const id = this.nextId();
    this.data[id] = item;
    this.onChange?.();
    return id;
  }

  removeItem(id:string){
    delete this.data[id];
    this.onChange?.();
  }

  updateItem(id:string, data:ItemType){
    this.data[id] = data;
    this.onChange?.();
  }

  getList(){
    return {...this.data};
  }

  setList(list:IListData<ItemType>){
    this.data = list;
    this.onChange?.();
  }
}

export class ListSocketClient<ItemType> implements IListClient<ItemType>{
  private socket: SocketClient;
  private model: ListModel<ItemType>;
  public onChange:(listData:IListData<ItemType>)=>void;

  constructor(socket: SocketClient, listModel:ListModel<ItemType>) {
    this.socket = socket;
    this.model = listModel;
    this.model.onChange = ()=>{
      this.onChange(this.model.getList());
    }
    this.socket.onMessage.add((response)=>{
      if (response.type == 'getList'){
        const responseData:IListData<ItemType> = JSON.parse(response.content);
        this.model.setList(responseData);
      }

      if (response.type == 'addItem'){
        const responseData:{id:string, item:ItemType} = JSON.parse(response.content);
        this.model.updateItem(responseData.id, responseData.item);
      }

      if (response.type == 'removeItem'){
        const itemId:string = JSON.parse(response.content);
        this.model.removeItem(itemId);
      }
      if (response.type == 'updateItem'){
        const responseData:{id:string, item:ItemType} = JSON.parse(response.content);
        this.model.updateItem(responseData.id, responseData.item);
      }

    });
  }

  addItem(item:ItemType){
    return this.socket.sendRequest('addItem', JSON.stringify(item));
  }

  removeItem(id:string){
    return this.socket.sendRequest('removeItem', id);
  }

  updateItem(id:string, data:ItemType){
    return this.socket.sendRequest('updateItem', JSON.stringify({ item: data, id }));
  }

  getList(){
    return this.socket.sendRequest('getList', JSON.stringify({}));
  }
}

