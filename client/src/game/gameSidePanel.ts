import Control from '../common/control';
import { GameModel } from "./gameModel";
import { IObjectInfo } from './dto';
import { IProgress } from './dto';

export class GameSidePanel extends Control{
  model: GameModel;

  updateHandler: () => void;
  updateProgress: (props: IProgress) => void;

  constructor(parentNode: HTMLElement,model: GameModel) {
    super(parentNode);
       this.model = model;

    this.updateHandler = () => {
      const availableObject = this.model.player.availableObject;
      this.update(availableObject)
    }
    this.model.onUpdateSidePanel.add(this.updateHandler);

    this.updateProgress = (props) => {
      const { progress, name } = props;
      this.updateObject(progress, name);
    }
    this.model.onUpdateSidePanelProgress.add(this.updateProgress);

    const availableObject = this.model.player.availableObject;
    this.update(availableObject)
  }

  update(availableObject: IObjectInfo[]) {
    ///todo: отрисовать панель и повесить клик
    availableObject.forEach(item => {
      const object = new Control(this.node);
      object.node.onclick = () => {
        this.model.player.addBuildsInProgress(item);
      }
    })
  }

  updateObject(progress: number, name: string) {
    
  }

  destroy() {
    this.model.onUpdateSidePanel.remove(this.updateHandler);
    this.model.onUpdateSidePanelProgress.remove(this.updateProgress);
  
  }
}