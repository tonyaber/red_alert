
import { IBuildConstructor } from "./IBuildConstructor";
import { Bomber } from "./units/bomber";
import { Dog } from "./units/dog";
import { HeavyTank } from "./units/heavyTank";
import { Soldier } from "./units/soldier";
import { Tank } from "./units/tank";
import { Truck } from "./units/truck";
import { BuildingCenter } from "./builds/buildingCenter";
import { Barrack } from "./builds/barrack";
import { EnergyPlant } from "./builds/energyPlant";
import { BigEnergyPlant } from "./builds/bigEnergyPlant";
import { DogHouse } from "./builds/dogHouse";
import { CarFactory } from "./builds/carFactory";
import { TechCenter } from "./builds/techCenter";
import { Radar } from "./builds/radar";
import { RepairStation } from "./builds/repairStation";
import { OreBarrel } from "./builds/oreBarrel";
import { OreFactory } from "./builds/oreFactory";
import { DefendTower } from "./builds/defendTower";
import { Gold } from './gold';
import { Rock } from './rock';

export const builds:Record<string, IBuildConstructor> = {
  'soldier': Soldier,
  'truck': Truck,
  'tank': Tank,
  'heavyTank': HeavyTank,
  'dog': Dog,
  'bomber': Bomber,
  'buildingCenter': BuildingCenter,
  'barrack': Barrack,
  'energyPlant': EnergyPlant,
  'bigEnergyPlant': BigEnergyPlant,
  'dogHouse': DogHouse,
  'carFactory': CarFactory,
  'techCenter': TechCenter,
  'radar': Radar,
  'repairStation': RepairStation,
  'oreBarrel': OreBarrel,
  'oreFactory': OreFactory,
  'defendTower': DefendTower,
  'gold': Gold,
  'rock': Rock,
};