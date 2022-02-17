import Control from "../../../common/control";
import { IClientModel } from "../game/IClientModel";
import style from "./authorization.css";
import session, { IStoreUser } from "./session";

export class Authorization extends Control {
  onAuth: (name: string) => void;
  onHome: () => void;

  constructor(parentNode: HTMLElement, socket: IClientModel) {
    super(parentNode, "div", style["main"], "");

    socket.onAuth = (name) => {
      this.onAuth(name);
    };

    const body = new Control(
      this.node, 
      "div", 
      style["body"]
    );

    const wrapper = new Control(
      body.node,
      "div",
      style["wrapper"],
      ``
    );

    const content = new Control(
      wrapper.node,
      "div",
      style["content"],
      ``
    );

    const userNameLabel = new Control<HTMLLabelElement>(
      content.node,
      "label",
      style["user_label"],
      "This is your name: "
    );
    // const userName = new Control(content.node, 'div', style['user_name'], `!!!user name!!!`);
    if (!session.has("user")) {
      session.user.name =  "user" + Math.floor(Math.random() * 100);
    }

    const userName = new Control<HTMLInputElement>(
      content.node,
      "input",
      style["user_name"],
      ""
    );
    userName.node.type = "text";
    userName.node.value = session.user.name;
    userName.node.onchange = (e) => {
      session.user.name = userName.node.value;
      session.save();
    };

    const play = new Control(
      content.node,
      "button",
      style["play_btn"],
      "Start play"
    );
    play.node.onclick = () => {
      socket.addUser();
    };

    const cancel = new Control(
      content.node,
      "button",
      style["cancel_btn"],
      "Cancel"
    );
    cancel.node.onclick = () => {
      this.onHome();
    };
  }
}
