import { IVector, Vector } from '../../../../common/vector';
import { findClosestGold } from '../../distance';
import { PlayerSide } from '../../playerSide';
import { AbstractBullet } from '../bullet/abstractBullet';
import { GameObject } from '../gameObject';
import { AbstractWeapon } from '../weapon/abstractWeapon';
import { AbstractUnitObject } from './abstractUnitObject';

export class Truck extends AbstractUnitObject{
  cash: number;
  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super(objects, playerSides, objectId, type, state);
    this.attackRadius = 1;
    this.cash = 0;
    this.findRadius = 30;
     this.weapon = new AbstractWeapon(AbstractBullet, this.attackRadius, 200);
    this.weapon.onBulletTarget = (point: Vector) => {
      this.cash += 200;
      this.onDamageTile?.(this.targetId, point);
      if (this.cash >= 3000) {
        this.data.action = 'cash';
      }
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
      //const oreFactory = this.objects.find(it=>it.)
    }
    
  }
}