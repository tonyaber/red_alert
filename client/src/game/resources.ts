import { ResourceLoader } from './loader';
import grass from '../assets/png/grass-min.png';

import tree from '../assets/png/rock_and_tree-min2.png';
import rock from '../assets/png/rock_and_tree-min.png';
import tree2 from '../assets/png/rock_and_tree-min3.png';
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
import map1 from '../assets/png/map1.png';
import map2 from '../assets/png/map2.png';
import map3 from '../assets/png/map3.png';
import map4 from '../assets/png/map4.png';
import explosion from '../assets/png/explosion_1.png';
import bullet from '../assets/png/bullet2.png'

import soldier_top from '../sprites/units/soldier_back_run.png';
import soldier_bottom from '../sprites/units/soldier_front_run.png';
import soldier_left from '../sprites/units/soldier_run_left.png';
import soldier_right from '../sprites/units/soldier_run_right.png';
import soldier_left_bottom from '../sprites/units/soldier_run_left_bottom.png';
import soldier_left_top from '../sprites/units/soldier_run_top_left.png';
import soldier_right_top from '../sprites/units/soldier_run_top_right.png';
import soldier_right_bottom from '../sprites/units/soldier_run_right_bottom.png';

//import map from '../assets/png/map.png';



export const resourceLoader = new ResourceLoader();

export const resources = {
  
  map1: map1,
  map2: map2,
  map3: map3,
  map4: map4,
  map: map,
  grass: grass,
  rock: rock,
  tree: tree,
  tree2: tree2,
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
  explosion: explosion,
  bullet: bullet,
  soldier_top,
  soldier_bottom,
  soldier_left,
  soldier_right,
  soldier_left_bottom,
  soldier_left_top,
  soldier_right_top,
  soldier_right_bottom
}