export class GameObject {
  data: { health: number };
  onUpdate: (id: string, state: any) => void;
  id: string;

  objects: [] = [];

  constructor(objects, playerSides) {
    //genId
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