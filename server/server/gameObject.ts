import { IVector, Vector } from "../../client/src/common/vector";
import { createIdGenerator } from "../../client/src/game/idGenerator";

export class GameObject {
  data: { health: number };
  onUpdate: (id: string, state: any) => void;
  id: string;

  objects: [] = [];
  position: Vector;
  name: string;

  constructor(objects, playerSides, position: IVector, name: string, id: string) {
    this.position = Vector.fromIVector(position)
    this.name = name;
    this.id = id;
  }

  tick(delta) {
    //logic
    this.objects.forEach(it => {
      if (it) {
        //it._update();
      }
    })
    //
  }
  update() {
    
  }
}