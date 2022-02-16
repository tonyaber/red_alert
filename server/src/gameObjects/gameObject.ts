import { IVector, Vector } from "../../../common/vector";
import { IGameObjectContent,IGameObjectData } from "../dto";
import { PlayerSide } from "../playerSide";
import { TilesCollection } from "../tileCollection";

export class GameObject {
  data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
    primary: false,
    action: null,
    target: null
  };
  onUpdate: ( state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData, subType: string) => void;
  onDelete: (state: IGameObjectData) => void;
  onDamageTile: (targetId: string, point: Vector) => void;
  objectId: string;

  objects: Record<string, GameObject> = {}

  subType: string;
  type: string;
  direction: Vector;
  target: Vector;
   buildMatrix: number[][];
  traceMap: TilesCollection;

  constructor(/*objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }*/) {
    // this.data.position = Vector.fromIVector(state.position);
    // this.target = this.data.position;
    // this.data.playerId = state.playerId;
    // this.data.health = 100;
    // this.type = type;
    // this.objectId = objectId;
  }

  setMap(traceMap: TilesCollection) {
    this.traceMap = traceMap;
  }

  tick(delta: number) {
    // if (Math.round(this.data.position.x) !== this.target.x && Math.round(this.data.position.y) !== this.target.y){
    //   this.data.position.add(this.direction.clone().scale(0.05));//setstate
    //   this.update();
    // }
    // //logic
    // this.objects.forEach(it => {
    //   if (it) {
    //     //it._update();
    //   }
    // })
    // //
  }

  create() {
    // this.onCreate({
    //   type: this.type,
    //   objectId: this.objectId,
    //   content: this.getState(),
    // }, this.subType); 
  }

  moveUnit(target: IVector) {
    //this.target = Vector.fromIVector(target);
    //this.direction = Vector.fromIVector(target).clone().sub(this.data.position);  
  }

  attack(targetId: string){
    
  }

  setState(callback:(data:IGameObjectContent)=>IGameObjectContent) {
     this.data = callback(this.getState());
     this.update();
  }

  getState() {
    return this.data;
  }

  getAllInfo() {
    return {
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    }
  }
 
  protected update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });    
  }
  damage(point: Vector, unit: GameObject) {
    
    if (this.data.health <= 0) {
      this.destroy();
    } else if(this.data.health>0){
      //console.log(this.data.health)
      this.setState((data) => {
        return {
          ...data,
          health:this.data.health-10,
        }
      })
    } 
  }

  destroy() {
    this.onDelete({
       type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });  
  }
}