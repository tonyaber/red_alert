import { IVector } from "../common/vector";

class GameObject{
  data:{health:number};
  onUpdate: (id:string, state:any)=>void;
  id:string;

  objects:[]=[];

  constructor(objects, playerSides){
    //genId
  }

  tick(delta){
    //logic
    this.objects.forEach(it=>{
      if(it){
        //it._update();
      }
    })
    //
  }

  _update(newState){
    //setState
    this.onUpdate(this.id, newState);
  }

}

class PlayerSide{
  money:number;
  buildings: Array<any>
  onUpdate:()=>void;
  onReady:(objectType:string)=>void;
  constructor(){

  }

  setMoney(){
    ///
    this.onUpdate();
  }

  startBuilding(objectType:string){
    return 'private'
  }

  pauseBuilding(objectType:string){

  }

  tick(delta){
    //onReady
  }
}

class GameModel{

  objects: Record<string, GameObject> = {};
  playersSides: Array<PlayerSide> =[];
  onUpdate: any;
  onSideUpdate: any;
  
  constructor(players){
    players.map //playersSides

    const playerSide: PlayerSide = new PlayerSide();
    playerSide.onUpdate = ()=>{
      this.onSideUpdate(/*playerId*/)
    }
    playerSide.onReady=(type)=>{
      this._addUnit();
    }
  }
  //player side methods
  startBuilding(playerId:string, objectType:string){
    //find by id
    const playerSide:/*PlayerSide*/ any ={}
    return 'private'
  }

  pauseBuilding(playerId:string, objectType:string){

  }

  private _completeBuilding(){

  }

  private _addUnit(){

  }

  //player methods
  addGameObject(playerId:string, objectType:string, position:IVector){
    //mapObject
    const gameObject = new GameObject(this.objects, this.playersSides);
    gameObject.onUpdate = (id, state)=>{
      this.onUpdate(id, state);
    }
    gameObject._update({});
    //
    return 'private';
  }

  moveUnits(playerId:string, unitIds:string[], target:IVector){
    //objectt.. setState
  }

  setAttackTarget(playerId:string, unit:string, target:string){

  }

  setPrimary(playerId:string, buildId:string){

  }

  //

  tick(delta){
    //objects
    //sides
  }
}


class PlayerController{
  gameModel: GameModel;
  playerId: string;
  
  constructor(playerId:string, gameModel:GameModel){
    this.gameModel = gameModel;
    this.playerId = playerId;
  }

  startBuilding(objectType:string){
    return this.gameModel.startBuilding(this.playerId, objectType);
  }

  addGameObject(objectType:string, position:IVector){
    return this.gameModel.addGameObject(this.playerId, objectType, position)
  }

  moveUnits(unitIds:string[], target:IVector){

  }

  setAttackTarget(unit:string, target:string){

  }

  setPrimary(buildId:string){

  }
}

interface IRegistedPlayerInfo{
  id:string,
  type: 'bot'|'human'|'spectator'
  connection?: any;//connection
}

class BotCommander{
  playerController: PlayerController;

  constructor(playerController:PlayerController){
    this.playerController = playerController;
  }

  private tick(delta){
    //logic
    const privateMessage=0;//this.playerController.addGameObject()
    //
  }

  sendMessage(message){ // self receive
    // can read response;
  }
}

class HumanCommander{
  playerController: PlayerController;
  connection: any;

  constructor(playerController:PlayerController, connection:any){
    this.playerController = playerController;
    this.connection = connection;
  }

  handleClientMessage(message){
    if (message == 'add'){
      const privateResponse = 0; //this.playerController.addGameObject()
      this.sendMessage(privateResponse);
    }
  }

  sendMessage(message){ //send to client
    this.connection.sendUTF(JSON.stringify(message));
  }
}


class Game{
  registredPlayersInfo: IRegistedPlayerInfo[] = [];

  players: (HumanCommander|BotCommander)[] = [];
  constructor(){
    
  }

  registerPlayer(type:'bot'|'human'|'spectator', userId:string, connection:any){
    this.registredPlayersInfo.push({type, id:userId, connection});
  }

  startGame(){
    const gamePlayersInfo = this.registredPlayersInfo.map(it=>it);
    const game = new GameModel(gamePlayersInfo);
    this.players = this.registredPlayersInfo.map(it=> {
      const playerController = new PlayerController(it.id, game);
      return new (it.type == 'bot'? BotCommander : HumanCommander)(playerController, it.connection );
    });

    game.onUpdate = (id, data)=>{
      this.players.forEach(player=> player.sendMessage({}))
    }
    game.onSideUpdate = (id, data)=>{
      this.players.find(it=>it).sendMessage(data);
    }
  }

  handleMessage(playerId, msg){
    //find player by id
    (this.players[playerId] as HumanCommander).handleClientMessage(msg);
  }
}

class Socket{
  
  connections: Record</*connection*/any, string|null> = {}
  //users:  Record<string, /*connection*/any> = {}

  games: Game[] = [];

  constructor(){
    const ws:any = {};
    const connection:any = ws.accept();
    connection.onMessage = (msg:any)=>{
      if (msg.type === 'auth'){
        //id
        this.connections[connection] = msg.id;
      }

      if (msg.type === 'gameMove'){
        const playerId = this.connections[connection]
        const gameId = msg.gameId;
        //find game by id
        this.games[gameId].handleMessage(playerId, msg.content);
      }

      // create new room
      // create 0 game
      //

      if (msg.type === 'registerGamePlayer'){
        const playerId = this.connections[connection]
        const gameId = msg.gameId;
        //find game by id
        this.games[gameId].registerPlayer('human', playerId, connection)
      }
    }
  }
}

/////////
///////client
///////////

class ClientSocket{
  constructor(){

  }

  sendMessage(message){
    ///
    return new Promise(()=>{});
  }

  onMessage(message){
    this.onMessage(message)
  }
}

class LocalModel //implements IClientModel
{
  onSideUpdate: any;
  onCanvasObjectUpdate: (response:IGameUpdateRespone)=>void;
  myPlayer: PlayerController;

  constructor(){

  }

  startGame(playersInfo){
    
    const gamePlayersInfo = playersInfo.map(it=>it);
    const game = new GameModel(gamePlayersInfo);
    const myPlayerController: PlayerController = new PlayerController('dfsdf', game);
    this.myPlayer = myPlayerController;
    const bots = playersInfo.map(it=> {
      const playerController = new PlayerController(it.id, game);
      return new BotCommander(playerController);
    });

    game.onUpdate = (id, data)=>{
      bots.forEach(player=> player.sendMessage({}));
      //this.onCanvasObjectUpdate();
    }
    game.onSideUpdate = (id, data)=>{
      bots.find(it=>it).sendMessage(data);
      this.onSideUpdate();
    }
  }

  //side

  startBuild(){
    //this.myPlayer.startBuilding();
  }

  pauseBuild(){

  }

  cancelBuild(){

  }

  //to map
  addBuild(){

  }

  setPrimary(){

  }

  moveUnit(){

  }

  setAttackTarget(){

  }

}

class SocketModel //implements IClientModel
{
  onSideUpdate: any;
  onCanvasObjectUpdate: (response:IGameUpdateRespone)=>void;
  private client: ClientSocket;

  constructor(client:ClientSocket){
    this.client = client;
    client.onMessage = (message)=>{
      if(message){
        this.onSideUpdate()  
      }

      if (message){
        this.onCanvasObjectUpdate(message)
      }
    }
  }

  //side

  startBuild(){
    this.client.sendMessage('');
  }

  pauseBuild(){

  }

  cancelBuild(){

  }

  //to map
  addBuild(){

  }

  setPrimary(){

  }

  moveUnit(){

  }

  setAttackTarget(){

  }

  //all game player methods
}

interface IGameObjectData{
  id: string;
  type: string;
  content: string; // or all fields
}

interface IGameUpdateRespone{
  type: 'update' | 'delete' | 'create';
  data: IGameObjectData;
}

class InteractiveObject{

}

class Canvas{
  interactives: Record<string, InteractiveObject> = {}

  canvas
  onGameMove:()=>void;

  constructor(){
    this.canvas.onmousemove =()=>{

    }
  }

  updateObject(data:IGameObjectData){

  }

  deleteObject(data:IGameObjectData){

  }
}

class SidePanel{
  money: any;//Control;
  buildsButtons: any[];

  onSelect:(selected)=>void;

  constructor(){

  }

  update(){

  };
}

class GameView{
  sidePanel: SidePanel;
  canvas: Canvas;
  //objects: InteractiveObject[]
  //use cach model or not

  constructor(model:SocketModel){
    this.sidePanel.onSelect = (selected)=>{
      if (selected.status == 'ready'){
        ///this.canvas.... get vector
        model.addBuild();
      } else if (selected.status == 'available') {
        model.startBuild()
      }
      
      
    }

    this.canvas.onGameMove = ()=>{
      model.startBuild();
    }

    model.onCanvasObjectUpdate = (response)=>{
      if (response.type == 'update'){
        this.canvas.updateObject(response.data);
      } else if(response.type == 'delete'){
        this.canvas.deleteObject(response.data);
      }
      
    }
  }
}