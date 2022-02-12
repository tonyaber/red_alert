import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import style from './roomPage.css'
import { IChatMsg } from '../game/dto'
import session from './session';

export class RoomPage/*SettingPage*/ extends Control{   //RoomPage???
  onStartGame: (players: string) => void;
  onCreateGame: () => void;
  constructor(parentNode: HTMLElement,socket: IClientModel) {
    super(parentNode, 'div', style['room_main'], 'Room Page');
    const lobby = new Control(this.node, 'div', style['lobby_wrapper'], 'lobby-room');
    const wrapperPlayers = new Control(lobby.node, 'div', style['players_wrapper'], 'Players');
    const wrapperChat = new Control(lobby.node, 'div', style['chat_wrapper'], 'Chat');
    const chat = new Control(wrapperChat.node, 'div', style['chat'], 'bla bla bla');
    // тут вставил текстарию... хотя не имеет значение как вносить значение
    const inputChat = new Control<HTMLInputElement>(wrapperChat.node, 'textarea', style['input_chat'], '');
    //Это просто для примера
    inputChat.node.setAttribute('rows','3');
    inputChat.node.setAttribute('cols','30');
    // кнопка для отпавки сообщений... можно еще повесть вызоы функции на энтер
    const btnSendMsg = new Control(wrapperChat.node, 'button', style['btn_send'], 'Send');

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
    // Это обрабатываются события Чата
    // Получение сообщений
    socket.onChatMsg = (msg: IChatMsg) => {      
      const newMsg = new Control(chat.node,'div','chat_msg','<b>'+msg.user+': </b>'+msg.msg);
    }
    // Отправка сообщений.Отдельная функция что бы проще было вешать событие кнопок.
    const fn_chatSend = ()=>{
      const msg ={
        user: session.get('user').name,
        msg: inputChat.node.value,
      }
      inputChat.node.value='';
      socket.chatSend(msg);
    }
    btnSendMsg.node.onclick = () => fn_chatSend();
  }
}

