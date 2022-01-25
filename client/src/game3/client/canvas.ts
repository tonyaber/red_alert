import Control from "../../common/control";
import { IGameObjectData } from "./dto";
import { InteractiveObject } from "./interactiveObject";

export class Canvas extends Control{
  interactiveList: Record<string, InteractiveObject> = {}

  
  onGameMove:()=>void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    
    this.node.onmousemove =()=>{

    }
  }

  updateObject(data:IGameObjectData){

  }

  deleteObject(data:IGameObjectData){

  }
}
