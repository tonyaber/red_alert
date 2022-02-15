import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import mapsData from '../game/maps.json';
import style from './settingsPage.css'
import InfoPage from './infoPage';

export interface IMapsData{
  size: string,
  players: number,
  name: string,
  src: string
}

const mapSizes = ['64x64', '64x96', '96x96', '128x96', '128x128']
/*
const defaultSettings: IGameOptions = {
  map: new Image(),//,defaultMap,
  credits: 10000
  //speed: 7,
}



export class SettingsModel {
  private settings: IGameOptions;
  constructor() {
    this.settings = defaultSettings;
  }

  loadFromStorage() {
    const storageData = localStorage.getItem('settings');
    const checkStorageData = (data: string | null) => {
      return !!data;
    }
    //if (!checkStorageData(storageData)) {
      this.settings = defaultSettings;
    // } else {
    //   const data: IGameOptions = JSON.parse(storageData); //todo не работает сохранение в локалстораж
    //   this.settings = data;
    // }
  }

  getData() {
    console.log(this.settings);
    return JSON.parse(JSON.stringify(this.settings));
  }

  setData(data: IGameOptions) {
    this.settings = data;
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }
}

*/

export interface IGameOptions  {
  map: HTMLImageElement;
  credits: number;
}

export class SettingsPage extends Control {
  onBack: () => void;
  onPlay: (settings: IGameOptions) => void;
  maps: IMapsData[];
  filteredMaps: IMapsData[];
  map: IMapsData;
  //mapImage: HTMLImageElement;
  credit: number;
  onStartGame: (players: string) => void;
  onAuth: (name:string) => void;
  nameUser: string;

  constructor(parentNode: HTMLElement, socket: IClientModel){//, initialSettings: IGameOptions/*, maps: IMapsData[]*/) {
    
    super(parentNode, 'div', style["main_wrapper"]);// TODO сделать анимацию страницы //{default: style["main_wrapper"], hidden: style["hide"]});    
   // this.socket = socket;
    socket.onAuth = (name) => {
      //this.onAuth(name);
      this.nameUser = name;
    }

  
    
    
    

    this.credit = 10000;/*initialSettings.credits;*/
     this.loadMapsData().then(result => {
      this.map = this.maps[0];
       this.render(socket);
    });
    // this.map = {
    //   size: '64x64',
    //   players: 4,
    //   name: 'some map',
    //   src: '../assets/png/gold_min.png'
    // }

    // this.render();


  }
  render(socket:IClientModel){
    const settingsWrapper = new Control(this.node, 'div', style['settings_wrapper']);

    const basicSettingsWrapper = new Control(settingsWrapper.node, 'div', style['basic_settings_wrapper']);
    const moneyWrapper = new Control(basicSettingsWrapper.node, 'div', style["item_wrapper"]);
    const moneyLabel = new Control<HTMLLabelElement>(moneyWrapper.node, 'label', '', 'Кредит')
    const moneyInput = new Control<HTMLInputElement>(moneyWrapper.node, 'input', style['input_settings']);
    moneyInput.node.type = 'text';
    moneyInput.node.value = '10000'
    moneyInput.node.onchange = () => {
      this.credit = Number(moneyInput.node.value);
    }

    const speedWrapper = new Control(basicSettingsWrapper.node, 'div', style["item_wrapper"]);
    const speedLabel = new Control<HTMLLabelElement>(speedWrapper.node, 'label', '', 'Скорость')
    const speedInput = new Control<HTMLInputElement>(speedWrapper.node, 'select', style['input_settings'], '7');
    for (let i = 1; i <= 7; i++) {
      const speedValue = new Control<HTMLOptionElement>(speedInput.node, 'option', style[''], `${i}`);
      speedValue.node.value = i.toString();
      speedValue.node.onclick = () => {
        //
      }
    }

    const selectedMapWrapper = new Control(basicSettingsWrapper.node, 'div', style["item_wrapper"]);
    const selectedMapLabel = new Control<HTMLLabelElement>(selectedMapWrapper.node, 'label', '', 'Выбранная карта:')
    const selectedMapInput = new Control<HTMLInputElement>(selectedMapWrapper.node, 'input', style['input_settings']);
    selectedMapInput.node.type = 'text';
    selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
    selectedMapInput.node.readOnly = true;

    const playersWrapper = new Control(settingsWrapper.node, 'div', style["players_wrapper"]);
    const players = new Control<HTMLLabelElement>(playersWrapper.node, 'textarea', style['players_area'], 'Игроки')

    const infoWrapper = new Control(settingsWrapper.node, 'div', style["info_wrapper"]);
    const info = new Control<HTMLLabelElement>(infoWrapper.node, 'textarea', style['info_area'], 'Информация')


    const mapWrapper = new Control(settingsWrapper.node, 'div', style["map_wrapper"]);
    const selectWrapper = new Control(mapWrapper.node, 'div', style["map_select_wrapper"], 'Choose map');

    // const selectLabel = new Control<HTMLLabelElement>(selectWrapper.node, 'label', style["map_label"], 'Choose map')
    const mapSlider = new Control(mapWrapper.node, 'div', style["map_slider"]);
   
    //const imageWrapper = new AnimatedControl(mapSlider.node, 'div', {default:style['image_map'], hidden:style['hide_map']});
    const imageWrapper = new Control(mapSlider.node, 'div', style['image_map']);
    const imageMap = new Image(200, 200);  
    
    imageWrapper.node.append(imageMap);

    this.setImageMap(imageMap);
    const nameMap = new Control(imageWrapper.node, 'div', style["name_map"], `${this.map.name}`)
    const prevButton = new Control(mapSlider.node, 'button', style["prev_slider_button"], `&#10094;`);
    prevButton.node.onclick = () => {
      // imageWrapper.node.classList.add(style['hide_map']);
      // imageWrapper.node.ontransitionend = () => {
      //   imageWrapper.node.classList.remove(style['hide_map']);
        let index = this.maps.indexOf(this.map);
        if (index == 0) {
          index = this.maps.length-1;
        } else index--;      
        this.setImageMap(imageMap, index);
        selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
      // }    
    }
    const nextButton = new Control(mapSlider.node, 'button', style["next_slider_button"], `&#10095;`);
    nextButton.node.onclick = () => { 
      // imageWrapper.node.classList.add(style['hide_map']);
      // imageWrapper.node.ontransitionend = () => {
        
        let index = this.maps.indexOf(this.map);
        if(index == this.maps.length-1) index = 0; else index++;      
        this.setImageMap(imageMap, index);
        selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
      //   imageWrapper.node.classList.remove(style['hide_map']);
      // } 
    }
    const buttonsWrapper = new Control(settingsWrapper.node, 'div', style["buttons_wrapper"]);
    const backButton = new Control(buttonsWrapper.node, 'button', '', 'back');
    backButton.node.onclick = () => {
      this.onBack();
    }

    const playButton = new Control(buttonsWrapper.node, 'button', '', 'play');
    playButton.node.onclick = () => {
      const settings:IGameOptions = {
        map: imageMap,//this.mapImage,
        credits: this.credit
      };
      // socket.onAuth = (name) => {
      //   this.onAuth(name);
      // }
      //socket.addUser();
      
      this.onPlay(settings);
    }

  }

  public async loadMapsData(){
    const res = await fetch(mapsData); 
    this.maps = await res.json();
    return this.maps;
  }

  setImageMap(imageMap: HTMLImageElement, num:number = 0){
    imageMap.src = this.maps[num].src; 
    imageMap.alt = `Карта ${this.maps[num].name} размером ${this.maps[num].size}`;
    this.map = this.maps[num];
    //this.mapImage = imageMap;
  }

  // changeMap(imageMap: HTMLImageElement, selectedMapInput: Control<HTMLInputElement>, num:number = 0){
  //   this.setImageMap(imageMap, num);
  //   selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
  //   //this.mapImage = imageMap;
  // }
}