module.exports = Constant;

function Constant() { }
//---------------------system----------------------
global.max_player_in_room = 2;
global.client_connect = 'connection';
global.client_disconnect = 'disconnect';
global.client_message = 'client.message';
//---------------------client custom----------------------
global.client_login = 'client.login';
global.client_signup = 'client.signup';
global.client_choose_game = 'client.choose.game';
global.client_choose_room = 'client.choose.room';
global.client_invite_friend = 'client.invite.friend';
global.client_chat = 'client.chat.message';

global.client_get_question = 'client.get.question';
global.client_answer = 'client.answer';
global.client_get_listroom = 'client.get.list.room';
//---------------------
global.client_answer_to_room = 'client.answer.to.room';
global.client_ready_to_room = 'client.ready.to.room';
global.client_time_out_to_room = 'client.time.out.to.room';
//---------------------server custom------------------
global.server_send_client_join_room = 'server.send.client.join.room';
global.server_send_question = 'server.send.question';
global.server_confirm_answer = 'server.confirm.answer';
global.server_send_listroom = 'server.send.listroom';
//---------------------
global.server_to_room_send_question = 'server.to.room.send.question';
global.server_to_room_confirm_answer = 'server.to.room.confirm.answer';
global.server_to_room_send_finish_match = 'server.to.room.send.finish.match';
global.server_to_room_confirm_ready = 'server.to.room.confirm.ready';
global.server_to_room_start_game = 'server.to.room.start.game';