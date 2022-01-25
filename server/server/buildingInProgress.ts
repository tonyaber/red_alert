import { IObject } from './dto';
export class BuildingProgress{
  object: IObject;
  progress: number = 0;

  get isReady() {
    return this.progress === this.object.time;
  }

  constructor(object: IObject) {
    this.object = object;
  }

  updateProgress(delta: number, money: number) {
    const segmentOfTime = delta*0.001
    let nextMoney = money - (this.object.cost / (this.object.time / segmentOfTime));
    
    this.progress += segmentOfTime;

    if (this.progress >= this.object.time) {
      const difference = this.progress - this.object.time;
      nextMoney =  nextMoney + (this.object.cost/(this.object.time/difference))
      this.progress = this.object.time;
    } 
    return +nextMoney;
  }
}