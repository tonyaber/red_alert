import { IVector, Vector } from '../../../../common/vector';
import { findClosestGold } from '../../distance';
import { PlayerSide } from '../../playerSide';
import { OreFactory } from '../builds/oreFactory';
import { AbstractBullet } from '../bullet/abstractBullet';
import { GameObject } from '../gameObject';
import { AbstractWeapon } from '../weapon/abstractWeapon';
import { AbstractUnitObject } from './abstractUnitObject';

export class Truck extends AbstractUnitObject{
  money: number;
  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super(objects, playerSides, objectId, type, state);
    this.attackRadius = 1;
    this.money = 0;
    this.findRadius = 30;
    this.weapon = new AbstractWeapon(AbstractBullet, this.attackRadius, 2000, objectId);
    this.weapon.onBulletTarget = (point: Vector, id: string) => {
      this.onDamageTile?.(this.targetId, point, id);
      if (this.data.action === 'attack'&&this.objects[this.targetId]) {
        if (this.objects[this.targetId].subType === 'gold') {
          this.money += 200;
        }else{
          this.money = 0;
          this.data.action = 'idle'
        }
        if (this.money >= 3000) {
          this.data.action = 'cash';
        }  
      }      
    }
    this.weapon.moveBullet = (position: Vector, id: string) => {
      this.moveBullet(position, id);
    }
  }
  

  findClosetEnemy() {
    if (this.data.action === 'idle') {
      const golds = Object.values(this.objects).filter(item => item.subType === 'gold').map(it=>it.getAllInfo());
      const closetGold = findClosestGold(this.data.position, golds);
      if (closetGold.distance < this.findRadius) {
        this.attack(closetGold.gold.objectId);
      }
    } if (this.data.action === 'cash') {
      const oreFactory = Object.values(this.objects).find(it => it instanceof OreFactory && it.data.playerId === this.data.playerId);
      if(oreFactory){
        this.attack(oreFactory.objectId);
      }
    }
    
  }
}