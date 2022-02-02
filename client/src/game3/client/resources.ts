import { ResourceLoader } from './loader';
import grass from './assets/grass.png';
import rocks from './assets/tree2.png';
import goldFull from './assets/gold_full.png';
import goldLow from './assets/gold_low.png';
import goldMed from './assets/gold_med.png';
import goldMin from './assets/gold_min.png';

import plant from './assets/plant.png';
import carFactory from './assets/carFactory.png';
import buildingCenter from './assets/buildingCenter.png';

import barac from './assets/barac.png';
import radar from './assets/radar.png';
import energy from './assets/energy.png';
import defendedTower from './assets/defendedTower.png'
//import map from './map96g.png';

import explosion from './assets/explosion_1.png'



export const resourceLoader = new ResourceLoader();

export const resources = {
  //map: map,
  grass: grass,
  rocks: rocks, 
  goldFull: goldFull,
  goldLow: goldLow,
  goldMed: goldMed,
  goldMin: goldMin,
  plant: plant,
  energy:energy,
  radar:radar,
  carFactory:carFactory,
  barac:barac,
  defendedTower:defendedTower,
  buildingCenter:buildingCenter,
  explosion: explosion
}