import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import mapsData from '../game/maps.json';
import style from './settingsPageSingle.css'
import Range from '../components/range'

export interface IMapsData{
  size: string,
  players: number,
  name: string,
  src: string
}
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
  map: HTMLImageElement,
  credits: number,
  speed: number,
  bots: number
}

export class SettingsPage extends Control {
  onBack: () => void;
  onPlay: (settings: IGameOptions) => void;
  maps: IMapsData[];
  map: IMapsData;
  gameOptions: IGameOptions = {
  map: new Image(200, 200),
  credits: 10000,
  speed: 7,
  bots: 5
  }; 
  onStartGame: (players: string) => void;
  onAuth: (name:string) => void;
  nameUser: string;

  constructor(parentNode: HTMLElement, socket: IClientModel){
    super(parentNode, 'div', style["main_wrapper"]);// TODO сделать анимацию страницы //{default: style["main_wrapper"], hidden: style["hide"]});    
    socket.onAuth = (name) => {
      this.nameUser = name;
    }

   // this.gameOptions.credits = 10000;/*initialSettings.credits;*/
    this.loadMapsData().then(result => {
      this.map = this.maps[0];
       this.render();
    });
  }
  render(){
    const settingsWrapper = new Control(this.node, 'div', style['settings_wrapper']);

    const basicSettingsWrapper = new Control(
      settingsWrapper.node,
      'div', 
      [style['basic_settings_wrapper'], style['grid_item']].join(' ')
    );
    const moneyLabel = new Control<HTMLLabelElement>(
      basicSettingsWrapper.node, 
      'label', 
      style['item_settings'], 
      'Your credit'
    );
    const money = new Range(basicSettingsWrapper.node,'0', '10000', '1000');
    money.onChange = (value) => {
      this.gameOptions.credits = +value;
    }

    const speedLabel = new Control<HTMLLabelElement>(
      basicSettingsWrapper.node,
      'label',
      style['item_settings'],
      'Game\'s speed'
    );
    const speed = new Range(basicSettingsWrapper.node, '1', '7', '1');
    speed.onChange = (value) => {
      this.gameOptions.speed = +value;
    }

    const countBotsLabel = new Control<HTMLLabelElement>(
      basicSettingsWrapper.node,
      'label',
      style['item_settings'],
      'Count of bots in game'
    );
    const countBots = new Range(basicSettingsWrapper.node, '1', '5', '1');
    countBots.onChange = (value) => {
      this.gameOptions.bots = +value;
    }
    
    const selectedMapLabel = new Control<HTMLLabelElement>(
      basicSettingsWrapper.node, 
      'label', 
      style['item_settings'], 
      'Choosen map is '
    );
    const selectedMapInput = new Control<HTMLInputElement>(
      basicSettingsWrapper.node, 
      'input', 
      [style['item_settings'], style['map_name']].join(' ')
    );
    selectedMapInput.node.type = 'text';
    selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
    selectedMapInput.node.readOnly = true;

    const mapWrapper = new Control(
      settingsWrapper.node, 
      'div', [style["map_wrapper"], style['grid_item']].join(' '),
      'Choose map'
    );
   // const selectWrapper = new Control(mapWrapper.node, 'div', style["map_select_wrapper"], 'Choose map');

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
      let index = this.maps.indexOf(this.map);
      if (index == 0) {
        index = this.maps.length-1;
      } else index--;      
      this.setImageMap(imageMap, index);
      selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
      nameMap.node.textContent = this.map.name;
    }
    const nextButton = new Control(mapSlider.node, 'button', style["next_slider_button"], `&#10095;`);
    nextButton.node.onclick = () => { 
      let index = this.maps.indexOf(this.map);
      if(index == this.maps.length-1) index = 0; else index++;      
      this.setImageMap(imageMap, index);
      selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
      nameMap.node.textContent = this.map.name;
    }
    
    const infoWrapper = new Control(
      settingsWrapper.node, 
      'div', 
      [style["info_wrapper"], style['grid_item']].join(' ')
    );
    const info = new Control<HTMLLabelElement>(infoWrapper.node, 'textarea', style['info_area'], 'Информация')
    info.node.textContent = `##### Frequently Asked Questions #####


    Q: The game will only show a small screen, how can I make it full screen ?
    
    A: Check your graphic driver settings and enable stretching/scaling. Also disable "Use letter- or windowboxing to make a best fit" in RedAlertConfig.exe(Settings)
    Note: The first single-player missions are very small, they might look weird if you choose a too high resolution(small screen surrounded by black)!
    
    
    Q: The game does not display properly and half of the screen is not visible, how to solve this problem?
    
    A: Disable Zooming/Dpi-Scaling in your windows display settings. Change it back to the default setting (100%) - Tutorial: http://www.sevenforums.com/tutorials/443-dpi-display-size-settings-change.html
    
    
    Q: I get an "Unable to set video mode" error, how can I start the game?
    
    A: If you get this error it either means your PC does not support the chosen resolution (use RedAlertConfig.exe(Settings) to change the resolution) or it might be a problem related to the CnC-ddraw. If all other resolutions also end up with the same error try one of the following options:
    
    1. Disable ddraw: Open RedAlertConfig.exe(Settings), go to "video options" and enable DDwrapper. If the problem still persists try to disable both, CnC-DDraw and DDwrapper. (Note: The game might run unstable without CnC-DDraw and DDwrapper)
    2. Play in window mode: Open RedAlertConfig.exe(Settings), go to "video options" and check "run in windowed mode"
    
    
    Q: How to play in High Resolution?
    
    A: Click the Settings Button and go to Video options to change the resolution
    
    
    Q: I got Video/Sound problems (delayed/choppy playback), how can I fix it?
    
    A: Click the Settings Button, go to "Video options" and Disable "Force Single CPU affinity"
    
    
    Q: I'm using Windows 8 and the game won't start, how can I make it working ?
    
    A: Click the Settings Button, go to "Video options" and Disable "CnC-DDraw" and "DDwrapper"
    
    
    Q: When I try to play an online game I always end up with a "Other system not responding" error, how can I solve this ?
    
    A: Allow the game(ra95-spawn.exe) and CnCNet(cncnet5.exe) in your Anti-Virus/Firewall. If you still keep getting the error then disable your Anti-Virus/Firewall and re-install the game to a -DIFFERENT FOLDER-
    
    
    Q: I cannot select multiple units with my mouse, how do i fix dragging?
    
    A: This problem is usually caused by left-handed mouse setups, check your windows mouse button settings and try to revert them
    
    
    Q: I have problems with my mouse cursor, how to solve it?
    
    A: Click the Settings Button, go to "Video options" and Disable "Enable mouse hack"`
    const buttonsWrapper = new Control(
      settingsWrapper.node, 
      'div', [style["buttons_wrapper"], style['grid_item']].join(' '));
    const backButton = new Control(buttonsWrapper.node, 'button', '', 'back');
    backButton.node.onclick = () => {
      this.onBack();
    }

    const playButton = new Control(buttonsWrapper.node, 'button', '', 'play');
    playButton.node.onclick = () => {
      // const settings:IGameOptions = {
      //   map: imageMap,//this.mapImage,
      //   credits: this.credit
      // };      
      this.onPlay(this.gameOptions);
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
    this.gameOptions.map= imageMap;
  }
}