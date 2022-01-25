
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