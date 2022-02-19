import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import style from './roomPage.css'
import { IChatMsg, IUserItem } from '../game/dto'
import session from './session';
import { AnimatedControl } from '../components/animatedControl';

export class RoomPage/*SettingPage*/ extends Control{   //RoomPage???
  onStartGame: (players: string) => void;
  onCreateGame: () => void;
  constructor(parentNode: HTMLElement,socket: IClientModel) {
    super(parentNode, 'div', style['room_main'], '');
    const lobby = new Control(this.node, 'div', style['lobby_wrapper'], '');

    //игроки
    const wrapperPlayers = new Control(lobby.node, 'div', style['players_wrapper'], 'Players');
    wrapperPlayers.node.innerHTML=''; 
    const badgePlayers = new Control(wrapperPlayers.node, 'div', [style['badge'], style['badge_players']].join(' '), 'players');
    socket.getUsersList().then(
      _=>{
        console.log('send get userList')
      }
    )
    socket.onUsersList = (msg:IUserItem[] ) => {    
       
      msg.forEach(x => {
        const user = new Control(wrapperPlayers.node, 'div', style['user_item'], x.name); 
        //const status = new Control(wrapperPlayers.node, 'div', style['user_item'], x.name); 
        user.node.style.background = '#6ecd43'

        console.log(x);        
      });
    }

    //чат
    const wrapperChat = new Control(lobby.node, 'div', style['chat_wrapper']);
    const badgeChat = new Control(wrapperChat.node, 'div', [style['badge'], style['badge_chat']].join(' '), 'CHAT');
    const chat = new Control(wrapperChat.node, 'div', style['chat'], '');
    // тут вставил текстарию... хотя не имеет значение как вносить значение
    const inputChat = new Control<HTMLInputElement>(wrapperChat.node, 'textarea', style['input_chat'], '');
    //Это просто для примера
    inputChat.node.setAttribute('rows','3');
    inputChat.node.setAttribute('cols','30');
    // кнопка для отпавки сообщений... можно еще повесть вызоы функции на энтер
    const btnSendMsg = new Control(wrapperChat.node, 'button', style['btn_send'], 'Send');

    const wrapperGames = new Control(lobby.node, 'div', style['games_wrapper']);
    const badgeGames = new Control(wrapperGames.node, 'div', [style['badge'], style['badge_games']].join(' '), 'games');
    const availableGames = new Control(wrapperGames.node, 'div', style['games']);
    const boxGames = new Control(availableGames.node, 'div', style['box_games']);
    for (let i = 0; i < 5; i++) {
      const btn = new Control(boxGames.node, 'button', style['btn_game'], `game ${i}`);
      btn.node.onclick = () => {
        wrapperGame.quickIn();
      }
    }

    const btnCreateMap = new Control(availableGames.node, 'button', style['btn_map'], 'create game');
    btnCreateMap.node.onclick = () => {
      this.onCreateGame();
    }    

    const wrapperGame = new AnimatedControl(
      wrapperGames.node, 
      'div', 
      {default:style['game_wrapper'], hidden:style['hide']}
    );
    wrapperGame.quickOut();
    const wrapper = new Control(wrapperGame.node, 'div', style['wrapper_item']);
    //добавляем инфу по игре
   

    const wrapperBtn = new Control(wrapperGame.node, 'div', style['wrapper_item']);
    const btnRegister = new Control(wrapperBtn.node, 'button', style['btn_register'], 'register');
    btnRegister.node.onclick = () => {
      socket.registerGamePlayer()
    }

    const btnSpectator = new Control(wrapperBtn.node, 'button', style['btn_spectator'], 'spectator');
    btnSpectator.node.onclick = () => {
      socket.registerSpectator();
    }

    const btnClose = new Control(wrapperBtn.node, 'button', style['btn_close'], 'close');
    btnClose.node.onclick = () => {
      wrapperGame.quickOut();
    }


    socket.onStartGame = (data: string) => {
      this.onStartGame(data);
    }
    // Это обрабатываются события Чата
    // Получение сообщений
    socket.onChatMsg = (msg: IChatMsg) => {      
      const newMsg = new Control(chat.node,'div','chat_msg','<b>'+msg.user+': </b>'+msg.msg); 
      if(msg.user === 'system') {
       // console.log('system_msg', msg.user);
        newMsg.node.classList.add('system_msg');
        newMsg.node.style.color = '#cc0000';
      }
    }


    // Отправка сообщений.Отдельная функция что бы проще было вешать событие кнопок.
    const fn_chatSend = ()=>{
      const msg ={
        user: session.user.name,
        msg: inputChat.node.value,
      }
      inputChat.node.value='';
      socket.chatSend(msg);
    }
    btnSendMsg.node.onclick = () => fn_chatSend();
  }
}

