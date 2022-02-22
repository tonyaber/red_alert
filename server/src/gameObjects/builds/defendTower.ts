import { IVector, Vector } from '../../../../common/vector';
import { findClosestUnit } from '../../distance';
import { PlayerSide } from '../../playerSide';
import { AbstractBullet } from '../bullet/abstractBullet';
import { GameObject } from '../gameObject';
import { AbstractWeapon } from '../weapon/abstractWeapon';
import { AbstractBuildObject } from './abstractBuildObject';

export class DefendTower extends AbstractBuildObject{
  attackRadius: number = 10;
  targetId: string;
  weapon: AbstractWeapon;
  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super(objects, playerSides, objectId, type, state);
    
    this.weapon = new AbstractWeapon(AbstractBullet, this.attackRadius, 2000, this.objectId);
    this.weapon.moveBullet = (position: Vector, id: string) => {
      this.moveBullet(position, id);
  
    }
    this.weapon.onBulletTarget = (point: Vector, id: string) => {
      this.onDamageTile?.(this.targetId, point, id);
    }
  } 

  tick(delta: number) { 
    
    const enemyUnits = Object.values(this.objects).filter(item => item.data.playerId != this.data.playerId && item.subType === 'unit').map(it => it.getAllInfo());
    const distanceUnit = findClosestUnit(this.data.position, enemyUnits);
   
    if (distanceUnit.distance < this.attackRadius) {
        this.weapon.position = Vector.fromIVector(this.data.position);
        this.weapon.tryShot(distanceUnit.unit.content.position);
        this.weapon.step(delta);
    }
  }
}