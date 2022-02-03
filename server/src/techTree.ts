//root
const buildingCenter = {
  deps: ['rootAccess'],
  desc: ['buildingCenter'],
  spawn: [""],
  name: 'buildingCenter',
  energy: 0,
  cost: 1000,
  subType: 'build',
  time: 1,
  mtx:[
    '0000'.split(''),
    '0110'.split(''),
    '1111'.split(''),
    '1111'.split(''),
  ]
}

//low
const energyPlant = {
  deps: ['buildingCenter'],
  desc: ['energyPlant'],
  spawn: [""],
  name: 'energyPlant',
  energy: -5,
  cost: 200,
  subType: 'build',
  time: 1,
  mtx: [
    '0000'.split(''),
    '1100'.split(''),
    '1111'.split(''),
    '1111'.split(''),
  ]
}

//medium
const barrack = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['barrack'],
  spawn: [""],
  name: 'barrack',
  energy: 3,
  cost: 400,
  subType: 'build',
  time: 1,
  mtx: [
    '0011'.split(''),
    '0011'.split(''),
    '1111'.split(''),
    '0011'.split(''),
  ]
}

const dogHouse = {
  deps: ['buildingCenter', 'energyPlant', 'barrack'],
  desc: ['dogHouse'],
  spawn: [""],
  name: 'dogHouse',
  energy: 2,
  cost: 200,
  subType: 'build',
  time: 10,
  mtx: [
    '0110'.split(''),
    '0110'.split(''),
    '0000'.split(''),
    '0000'.split(''),
  ]
}

const oreFactory = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['oreFactory'],
  spawn: [""],
  name: 'oreFactory',
  energy: 5,
  cost: 1000,
  subType: 'build',
  time: 50,
  mtx: [
    '0110'.split(''),
    '0110'.split(''),
    '1111'.split(''),
    '1111'.split(''),
  ]
}

const oreBarrel = {
  deps: ['buildingCenter', 'energyPlant', 'oreFactory'],
  desc: ['oreBarrel'],
  spawn: [""],
  name: 'oreBarrel',
  energy: 1,
  cost: 100,
  subType: 'build',
  time: 5,
  mtx: [
    '0110'.split(''),
    '0110'.split(''),
    '0000'.split(''),
    '0000'.split(''),
  ]
}

const carFactory = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['carFactory'],
  spawn: [""],
  name: 'carFactory',
  energy: 5,
  cost: 1500,
  subType: 'build',
  time: 30,
  mtx: [
    '0110'.split(''),
    '0111'.split(''),
    '1111'.split(''),
    '0000'.split(''),
  ]
}

const bigEnergyPlant = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['energyCenter'],
  spawn: [""],
  name: 'energyCenter',
  energy: -12,
  cost: 400,
  subType: 'build',
  time: 20,
  mtx: [
    '0110'.split(''),
    '0110'.split(''),
    '0110'.split(''),
    '0110'.split(''),
  ]
}

const defendTower = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['defendTower'],
  spawn: [""],
  name: 'defendTower',
  energy: 5,
  cost: 1000,
  subType: 'build',
  time: 30,
  mtx: [
    '0110'.split(''),
    '0110'.split(''),
    '0000'.split(''),
    '0000'.split(''),
  ]
}

//high
const radar = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['radar'],
  spawn: [""],
  name: 'radar',
  energy: 10,
  cost: 1000,
  subType: 'build',
  time: 50,
  mtx: [
    '0111'.split(''),
    '0111'.split(''),
    '0000'.split(''),
    '0000'.split(''),
  ]
}

const repairStation = {
  deps: ['buildingCenter', 'energyPlant'],
  desc: ['repairStation'],
  name: 'repairStation',
  spawn: [""],
  energy: 10,
  cost: 1500,
  subType: 'build',
  time: 50,
  mtx: [
    '0111'.split(''),
    '0111'.split(''),
    '0111'.split(''),
    '0000'.split(''),
  ]
}

const techCenter = {
  deps: ['buildingCenter', 'energyPlant', "radar", "repairStation"],
  desc: ['techCenter'],
  spawn: [""],
  name: 'techCenter',
  energy: 10,
  cost: 1500,
  time: 100,
  subType: 'build',
  mtx: [
    '0110'.split(''),
    '1111'.split(''),
    '0110'.split(''),
    '0000'.split(''),
  ]
}

//units
const soldier = {
  deps: ["barrack"],
  spawn: ["barrack"],
  name: 'soldier',
  cost: 100,
  time: 5,
  radius: 10,
  subType: 'unit',
  speed: 5,
  minRadius: 0, 
  reloadingTime: 5,
}

const dog = {
  deps: ["dogHouse"],
  spawn: ["dogHouse"],
  name: 'dog',
  cost: 150,
  time: 5,
  radius: 0,
  subType: 'unit',
  speed: 7,
  minRadius: 0, 
  reloadingTime: 5,
}

const tank = {
  deps: ["carFactory"],
  spawn: ["carFactory"],
  name: 'tank',
  cost: 700,
  time: 20,
  radius: 20,
  subType: 'unit',
  speed: 10,
  minRadius: 10, 
  reloadingTime: 20,
}

const truck = {
  deps: ["carFactory"],
  spawn: ["carFactory"],
  name: 'truck',
  cost: 1000,
  time: 10,
  radius: 20,
  subType: 'unit',
  speed: 40,
  minRadius: 5, 
  reloadingTime: 15,
}

const heavyTank = {
  deps: ["carFactory", "techCenter"],
  spawn: ["carFactory"],
  name: 'heavyTank',
  cost: 1500,
  time: 30,
  radius: 30,
  subType: 'unit',
  speed: 10,
  minRadius: 5, 
  reloadingTime: 30,
}

const bomber = {
  deps: ["barrack", "techCenter"],
  spawn: ["barrack"],
  name: 'bomber',
  cost: 1000,
  time: 20,
  radius: 50,
  subType: 'unit',
  speed: 50,
  minRadius: 0, 
  reloadingTime: 35,
}

export const tech = {
  object:
  [
    buildingCenter,
    barrack,
    energyPlant,
    bigEnergyPlant,
    dogHouse,
    carFactory,
    techCenter,
    radar,
    repairStation,
    oreBarrel,
    oreFactory,
    defendTower,
    soldier,
    truck,
    bomber,
    tank,
    heavyTank,
    dog
  ]
}

