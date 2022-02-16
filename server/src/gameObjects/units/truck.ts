import { IVector } from '../../../../common/vector';
import { findClosestGold } from '../../distance';
import { PlayerSide } from '../../playerSide';
import { GameObject } from '../gameObject';
import { AbstractUnitObject } from './abstractUnitObject';

export class Truck extends AbstractUnitObject{
  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super(objects, playerSides, objectId, type, state);
    this.attackRadius = 1;
    this.findRadius = 30;
  }

  findClosetEnemy() {
    const golds = Object.values(this.objects).filter(item => item.subType === 'gold').map(it=>it.getAllInfo());
    const closetGold = findClosestGold(this.data.position, golds);
    if (closetGold.distance < this.findRadius) {
      this.attack(closetGold.gold.objectId);
    }
  }
}