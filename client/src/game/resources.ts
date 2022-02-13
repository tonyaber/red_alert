import { ResourceLoader } from './loader';
import grass from '../assets/png/grass.png';
import rocks from '../assets/png/tree2.png';
import goldFull from '../assets/png/gold_full.png';
import goldLow from '../assets/png/gold_low.png';
import goldMed from '../assets/png/gold_med.png';
import goldMin from '../assets/png/gold_min.png';

import plant from '../assets/png/plant.png';
import carFactory from '../assets/png/carFactory.png';
import buildingCenter from '../assets/png/buildingCenter.png';

import barrack from '../assets/png/barrack.png';
import radar from '../assets/png/radar.png';
import energy from '../assets/png/energy.png';
import defendedTower from '../assets/png/defendedTower.png'
import map from '../assets/png/map96g.png';

import explosion from '../assets/png/explosion_1.png'

//import map from '../assets/png/map.png';



export const resourceLoader = new ResourceLoader();

export const resources = {
  map: map,
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
  barrack:barrack,
  defendedTower:defendedTower,
  buildingCenter:buildingCenter,
  explosion: explosion
}