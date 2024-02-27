const enum Datatype {
  LOGIN = 'reg',
  CREATE_NEW_ROOM = 'create_room',
  PLAY_WITH_BOT = 'single_play',
  UPDATE_ROOM = 'update_room',
  UPDATE_WINNERS = 'update_winners',  
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  TURN = 'turn',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  FINISH = 'finish',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',  
}

export default Datatype;
