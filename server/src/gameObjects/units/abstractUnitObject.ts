import { IVector, Vector } from "../../../../common/vector";
import { IGameObjectContent, IGameObjectData } from "../../dto";
import { PlayerSide } from "../../playerSide";
import { GameObject } from "../gameObject"

export class AbstractUnitObject extends GameObject{
  data: IGameObjectContent = {
    position: null,
    health: null,
    playerId: null,
    action: null,
    target: null
  };
  onUpdate: ( state: IGameObjectData) => void;
  onCreate: (state: IGameObjectData) => void;
  onDelete:(state: IGameObjectData) => void;
  objectId: string;

  objects: Record<string, GameObject>;

  subType: string;
  type: string;
  direction: Vector;
  action: string;
  targetId: string;


  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super();
    this.objects = objects;
    this.data.position = Vector.fromIVector(state.position);
    this.data.playerId = state.playerId;
    this.data.health = 100;
    this.type = type;
    this.objectId = objectId;
  }
   
    // //logic
    // this.objects.forEach(it => {
    //   if (it) {
    //     //it._update();
    //   }
    // })
    // //
  tick(delta: number) {
    if (this.action === 'move') {
      if (this.data.target && Math.round(this.data.position.x) !== this.data.target.x && Math.round(this.data.position.y) !== this.data.target.y){
        this.setState((data ) => {
          return {
            ...data,
            position: this.data.position.add(this.direction.clone().scale(delta * 0.0001))
          };
        })
      }
    }
    //написать логику движения до врага
    
    if (this.action === 'attack') {
      //to do something
    }
  }
  create() {
     this.onCreate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    }); 
  }
   
  moveUnit(target: IVector) {
    this.action = 'move';
    this.direction = Vector.fromIVector(target).clone().sub(this.data.position);  
    this.setState((data ) => {
      return {
        ...data,
        target: Vector.fromIVector(target),
      }
    })
  }

  attack(targetId: string) {
    this.action = 'move'; //attack
    const target = this.objects[targetId].data.position;
    this.direction = target.clone().sub(this.data.position);  
   this.setState((data ) => {
      return {
        ...data,
        target,
      }
    })
  }

  setState(callback:(data:IGameObjectContent)=>IGameObjectContent) {
    this.data = callback(this.getState());
    this.update();
  }

  getState() {
    return this.data;
  }
  
  update() {
    this.onUpdate({
      type: this.type,
      objectId: this.objectId,
      content: this.getState(),
    });    
  }
}

