export interface ITickable{
  tick: (deltaTime: number) => void;
}

export class TickList {
  setInt: NodeJS.Timer;
  tickable: ITickable[] = [];
  lastTick: number;
  
  constructor() {
    this.lastTick = Date.now();
    this.setInt = setInterval(() => {
      const currentTick = Date.now()
      const delta = currentTick - this.lastTick;
      this.lastTick = currentTick;
      this.tickable.forEach(item => {
        item.tick(delta);
      })
    }, 200)
  }

  add(item:ITickable) {
    this.tickable.push(item);
  }

  remove(item: ITickable) {
    this.tickable = this.tickable.filter(it => it !== item);
  }

}