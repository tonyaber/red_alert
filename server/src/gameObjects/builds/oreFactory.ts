import { Game } from '../../../../client/src/game/game';
import { IVector, Vector } from '../../../../common/vector';
import { PlayerSide } from '../../playerSide';
import { GameObject } from '../gameObject';
import { AbstractBuildObject } from './abstractBuildObject';
import { Truck } from '../units/truck';

export class OreFactory extends AbstractBuildObject{
  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super(objects, playerSides, objectId, type, state);
  } 

  damage(point: Vector, unit: GameObject) {
    console.log(1111)
    if (this.data.health <= 0) {
      this.destroy();
    } else if (unit instanceof Truck) { 
      this.playerSides.find(it => it.id === this.data.playerId).setMoney((unit as Truck).money);
      
    }else if(this.data.health>0){
      //console.log(this.data.health)
      this.setState((data) => {
        return {
          ...data,
          health:this.data.health-10,
        }
      })
    } 
  }
}