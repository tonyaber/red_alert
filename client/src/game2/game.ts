
class ClientSocket{

}


class Obj{
  model: any;
  data: any;
  id:any;

  constructor(model, data, id){
    this.model = model;
    this.data = data;
    this.id = id;
  }

  tick(){
    this.damage();
  }

  damage(){
    this.setState({...this.data, f:33}); 
  }

  setState(newState){
    this.model.update(this.id, newState);
  }
}

interface IConnection{
  sendUTF:(msg)=>void;
  onMessage:(msg)=>void;
}
class Bot{
  model: ServerModel;
  connection: IConnection;

  constructor(model:ServerModel){
    this.model = model
    this.connection.onMessage = (msg)=>{

    }
  }

  logic(){
    this.model.add(43)
  }
}

class Player{
  model: ServerModel;
  connection: IConnection;

  constructor(model:ServerModel){
    this.model = model
  }  
}

class ServerModel{
  tickList
  constructor(){

  }

  addUser(){

  }

  add(objData){
    const newObj = new Obj(this, objData, 0);
    this.publicResponse();
    return 'privateResponse';
  }

  publicResponse(){

  }
}
class ServerSocket{
  serverModel: ServerModel;

  constructor(serverModel:ServerModel){
    this.serverModel = serverModel;
  }

  endpoint1(message){
    const resp = this.serverModel.add(message.objData);
    //sendPrivate({resp, respId: message.respId})
  }

  endpoint2(){

  }
}