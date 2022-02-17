import {Vector, IVector} from "../../../../common/vector";
import { AbstractBullet } from "../bullet/abstractBullet";
import { createIdGenerator } from "../../idGenerator";
interface IBulletConstructor{
  new(target: Vector, position: Vector, id: string): AbstractBullet;
}

export class AbstractWeapon{
  attackRadius: number;
  bullets: Array<AbstractBullet> = [];
  reloadTime: number;
  
  private loading: number = 0;
  private BulletConstructor: IBulletConstructor;
  position:Vector;
  onBulletTarget: (point: Vector, id: string) => void;
  moveBullet:  (point: Vector, id: string) => void;
  nextId: () => string;

  constructor(BulletConstructor:IBulletConstructor, attackRadius: number, reloadTime: number, id: string){
    this.BulletConstructor = BulletConstructor;
    this.attackRadius = attackRadius; 
    this.reloadTime = reloadTime;
    this.nextId = createIdGenerator('bullet' + id);
  }

  step(delta: number) {
    this.loading -= delta;
    this.bullets.forEach(it=>it.step(delta));
  }

  render(ctx:CanvasRenderingContext2D, camera:Vector){
    //this.bullets.forEach(it=>it.render(ctx, camera));
  }

  tryShot(target:Vector){
    //if (!this.position) {console.log('no pos'); return;}
   //console.log('weapon',  target.clone().sub(this.position.clone()).abs(), this.attackRadius)
    //if (this.loading<=0 && target.clone().sub(this.position.clone().scale(this.tileSize)).abs()<this.attackRadius){
      //console.log('radiused');

      this.shot(target.clone());
    
      
     // return true;
    //}
    
   // return false;
  }

  private shot(target: Vector) {
    if (this.loading <= 0) {
      const bullet = new this.BulletConstructor(target.clone(), this.position.clone(), this.nextId());
      this.loading = this.reloadTime;
      bullet.onMoveBullet = (position: Vector, id: string) => {
        this.moveBullet(position, id);
      }
      bullet.onTarget = (id: string)=>{
        this.bullets = this.bullets.filter(it=>it!=bullet);    
        this.onBulletTarget?.(target.clone(), id);
      }
      this.bullets.push(bullet);
    }
    
  }
}