import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import style from './roomPage.css'
import { IChatMsg } from '../game/dto'

export class RoomPage/*SettingPage*/ extends Control{   //RoomPage???
  onStartGame: (players: string) => void;
  onCreateGame: () => void;
  constructor(parentNode: HTMLElement,socket: IClientModel) {
    super(parentNode, 'div', style['room_main'], 'Room Page');
    const lobby = new Control(this.node, 'div', style['lobby_wrapper'], 'lobby-room');
    const wrapperPlayers = new Control(lobby.node, 'div', style['players_wrapper'], 'Players');
    const wrapperChat = new Control(lobby.node, 'div', style['chat_wrapper'], 'Chat');
    const chat = new Control(wrapperChat.node, 'div', style['chat'], 'bla bla bla');
    const inputChat = new Control(wrapperChat.node, 'div', style['input_chat'], '');
    // inputChat.node.
    const wrapperGames = new Control(lobby.node, 'div', style['games_wrapper'], 'Games');
    const btnCreateMap = new Control(this.node, 'button', style['btn_map'], 'Create game');
    btnCreateMap.node.onclick = () => {
      this.onCreateGame();
    }
    const btnRegister = new Control(this.node, 'button', style['btn_register'], 'Register');
    btnRegister.node.onclick = () => {
      socket.registerGamePlayer()
    }
    const btnSpectator = new Control(this.node, 'button', '', 'Spectator');
    btnSpectator.node.onclick = () => {
      socket.registerSpectator();
    }
    socket.onStartGame = (data: string) => {
      this.onStartGame(data);
    }
    socket.onChatMsg = (msg: IChatMsg) => {
      const newMsg = new Control(chat.node,'div','chat_msg',msg.msg);
    }
  }
}

