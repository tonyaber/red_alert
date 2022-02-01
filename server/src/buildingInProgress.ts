import { IObjectInfo } from './dto';

export class BuildingProgress{
  object: IObjectInfo;
  progress: number = 0;

  get isReady() {
    return this.progress === this.object.object.time;
  }

  constructor(object: IObjectInfo) {
    this.object = object;
  }

  updateProgress(delta: number, money: number) {
    const segmentOfTime = delta*0.001;
    let nextMoney = (this.object.object.cost / (this.object.object.time / segmentOfTime));
    if (money - nextMoney > 0) {
      this.progress += segmentOfTime;

      if (this.progress >= this.object.object.time) {
        const difference = this.progress - this.object.object.time;
        nextMoney =  nextMoney - (this.object.object.cost/(this.object.object.time/difference))
        this.progress = this.object.object.time;
      }     
    } else {
      nextMoney = null;
    }
    return +nextMoney;
  }
}