import Control from "../../../common/control";
import { IObjectInfo } from "./dto";
import { buildSidePanel } from './buildSidePanel';
import red from './red.css'

export class SidePanel extends Control{
  money: Control;
  buildButtons: any = [];
  onSidePanelClick: (selected: string, object: IObjectInfo)=>void;
  unitNode: Control<HTMLElement>;
  buildNode: Control<HTMLElement>;
  buildingsFirstColumnFooter: Control<HTMLElement>;
  buttonFirstColumnUp: Control<HTMLElement>;
  buttonFirstColumnDown: Control<HTMLElement>;
  buildingsSecondColumnFooter: Control<HTMLElement>;
  buttonSecondColumnUp: Control<HTMLElement>;
  buttonSecondColumnDown: Control<HTMLElement>;
  //buildAvailbe: string[];
  buildAvailable: IObjectInfo[] = [];
  unitsAvailable: IObjectInfo[] = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', red['game_side']); 
    this.money = new Control(this.node, 'div', red['aside-top-panel']);
    const radar = new Control(this.node, 'div', red['game_radar']);
    const wrapperControls = new Control(this.node, 'div', red['wrapper_controls']);
    const repairBtn = new Control(wrapperControls.node, 'button', red['repair_button'] , '')
    const cashBtn = new Control(wrapperControls.node, 'button', red['cash_button'], '')
    const mapBtn = new Control(wrapperControls.node, 'button', red['map_button'], '')

    const wrapperEquipment = new Control(this.node, 'div', red['wrapper_equipment']);
    const energy = new Control(wrapperEquipment.node, 'div', red['energy']);

    const wrapperBuildings = new Control(wrapperEquipment.node, 'div', red["builds_column"]);
    this.buildNode = new Control(wrapperBuildings.node, 'div', red['column_items'], '');
    this.buildingsFirstColumnFooter = new Control(wrapperBuildings.node, 'div', red["column_footer"]);
    this.buttonFirstColumnUp = new Control(this.buildingsFirstColumnFooter.node, 'div', red["button"] + ' ' + red["button_up"]);
    this.buttonFirstColumnDown = new Control(this.buildingsFirstColumnFooter.node, 'div', red["button"] + ' ' + red["button_down"]);
    this.changeFirstColumnButtonsState();

    this.buttonFirstColumnUp.node.onclick = () => {
      let colMarginTop = this.buildNode.node.style.marginTop.replace(/[^0-9,-]/g, "")
      let freeSpace = (window.innerHeight - 300 - (this.buildAvailable.length * 100) - Number(colMarginTop))
      if (freeSpace < 100) {
        this.buildNode.node.style.marginTop = String(Number(colMarginTop) - 100) + 'px';
        this.changeFirstColumnButtonsState()
      }
    }
    this.buttonFirstColumnDown.node.onclick = () => {
      let colMarginTop = this.buildNode.node.style.marginTop.replace(/[^0-9,-]/g, "")
      if (Number(colMarginTop) < 0) {
        this.buildNode.node.style.marginTop = String(Number(colMarginTop) + 100) + 'px';
        this.changeFirstColumnButtonsState()
      }
    }     
    const wrapperUnits = new Control(wrapperEquipment.node, 'div', red["builds_column"]);
    this.unitNode = new Control(wrapperUnits.node, 'div', red['column_items'], '');
    this.buildingsSecondColumnFooter = new Control(wrapperUnits.node, 'div', red["column_footer"]);
    this.buttonSecondColumnUp = new Control(this.buildingsSecondColumnFooter.node, 'div', red["button"] + ' ' + red["button_up"]);
    this.buttonSecondColumnDown = new Control(this.buildingsSecondColumnFooter.node, 'div', red["button"] + ' ' + red["button_down"]);
    this.changeSecondColumnButtonsState();
    this.buttonSecondColumnUp.node.onclick = () => {
      let colMarginTop = this.unitNode.node.style.marginTop.replace(/[^0-9,-]/g, "")
      let freeSpace = (window.innerHeight - 300 - (this.unitsAvailable.length * 100) - Number(colMarginTop))
      if (freeSpace < 100) {
        this.unitNode.node.style.marginTop = String(Number(colMarginTop) - 100) + 'px';
        this.changeSecondColumnButtonsState()
      }
    }
    this.buttonSecondColumnDown.node.onclick = () => {
      let colMarginTop = this.unitNode.node.style.marginTop.replace(/[^0-9,-]/g, "")
      if (Number(colMarginTop) < 0) {
        this.unitNode.node.style.marginTop = String(Number(colMarginTop) + 100) + 'px';
        this.changeSecondColumnButtonsState()
      }
    }     
  }

  changeFirstColumnButtonsState() {
    // Менять состояние кнопок вверх/вниз в зависимости от количества Построек
    let colMarginTop = this.buildNode.node.style.marginTop.replace(/[^0-9,-]/g, "")
    let freeSpace = (window.innerHeight - 300 - (this.buildAvailable.length * 100) - Number(colMarginTop));
    //console.log('freeSpace', freeSpace);
    //console.log('this.buildAvailable.length', this.buildAvailable.length);
    if (freeSpace > 100) {
      this.buttonFirstColumnUp.node.classList.add(red["button__inactive"]) //перемотка вверх не нужна
    } else {
      this.buttonFirstColumnUp.node.classList.remove(red["button__inactive"]) //перемотка вверх нужна
    }
    if (Number(colMarginTop) < 0) {
      this.buttonFirstColumnDown.node.classList.remove(red["button__inactive"]) //перемотка вниз нужна
    } else {
      this.buttonFirstColumnDown.node.classList.add(red["button__inactive"]) //перемотка вниз не нужна
    }    
  }

  changeSecondColumnButtonsState() {
    // Менять состояние кнопок вверх/вниз в зависимости от количества Юнитов
    let colMarginTop = this.unitNode.node.style.marginTop.replace(/[^0-9,-]/g, "")
    let freeSpace = (window.innerHeight - 300 - this.unitsAvailable.length * 100 - Number(colMarginTop))
    if (freeSpace > 100) {
      this.buttonSecondColumnUp.node.classList.add(red["button__inactive"]) //перемотка вверх не нужна
    } else {
      this.buttonSecondColumnUp.node.classList.remove(red["button__inactive"]) //перемотка вверх нужна
    }
    if (Number(colMarginTop) < 0) {
      this.buttonSecondColumnDown.node.classList.remove(red["button__inactive"]) //перемотка вниз нужна
    } else {
      this.buttonSecondColumnDown.node.classList.add(red["button__inactive"]) //перемотка вниз не нужна
    }    
  }



  update(data: { sidePanelData: IObjectInfo[], money: number }) {
   
    this.money.node.textContent = data.money.toFixed(2).toString();
    
    data.sidePanelData.map(item => {
      if (this.buildButtons[item.object.name]) {
        this.buildButtons[item.object.name].update(item)
      } else {
        const nodeParent = item.object.subType === 'build' ? this.buildNode : this.unitNode;
        const obj = new buildSidePanel(nodeParent.node);
        obj.node.classList.add(red[`${item.object.name}`]);
        obj.onAvailableClick = (data) => {
          this.onSidePanelClick('onAvailableClick', data)
        }
        obj.onInprogressClick = (data) => {
          this.onSidePanelClick('onInprogressClick', data)
        }

        obj.onIsPauseClick = (data)=>{
          this.onSidePanelClick('onIsPauseClick', data)
        }

        obj.onIsReadyClick = (data) => {
          this.onSidePanelClick('onIsReadyClick', data)
        }
        obj.update(item);
        this.buildButtons[item.object.name] = obj; 
        
           
      }      
    })
    const keys = Object.keys(this.buildButtons);
    // console.log('buildBtn', this.buildButtons);
    // console.log('data.sidePanelData', data.sidePanelData);
    this.buildAvailable = data.sidePanelData.filter(it => it.object.subType === 'build' && it.status === 'available');
    //console.log('Available', this.buildAvailable);
    this.unitsAvailable = data.sidePanelData.filter(it => it.object.subType === 'unit' && it.status === 'available');
   // console.log('Available', this.unitsAvailable);
    this.changeFirstColumnButtonsState();
    if (data.sidePanelData.length !== keys.length) {
      keys.map(item => {
        if (!data.sidePanelData.find(it => it.object.name === item)) {
          this.buildButtons[item].destroy();
        }
      })
    }   
  };
}