module.exports = Constant;

function Constant() { }
//---------------------system----------------------
global.port = 2015;
global.max_listener = 1000000;
global.time_wait_to_finish_question = 5000;
global.time_wait_to_finish_match = 3000;
global.room_default_quantity = 9;
global.time_answer_question = 30;
global.max_number_question_in_room = 2;
global.max_player_in_room = 2;
global.timeout = 1000;
global.client_connect = 'connection';
global.client_disconnect = 'disconnect';
global.client_message = 'client.message';
//---------------------client custom----------------------
global.MoneyMoldys = [
    200000, 400000, 600000, 1000000, 2000000,
    3000000, 6000000, 10000000, 14000000, 22000000,
    30000000, 40000000, 60000000, 85000000, 150000000
];
global.client_login = 'client.login';
global.client_signup_name = 'client.signup.name';
global.client_signup = 'client.signup';
global.client_choose_game = 'client.choose.game';
global.client_choose_room = 'client.choose.room';
global.client_invite_friend = 'client.invite.friend';
global.client_chat = 'client.chat.message';

global.client_get_question = 'client.get.question';
global.client_answer = 'client.answer';
global.client_get_listroom = 'client.get.list.room';
global.client_get_record = 'client.get.record';
global.client_save_record = 'client.save.record';
global.client_reconnect = 'client.reconnect';
//---------------------
global.client_answer_to_room = 'client.answer.to.room';
global.client_ready_to_room = 'client.ready.to.room';
global.client_time_out_to_room = 'client.time.out.to.room';
global.client_leave_room = 'client.leave.room';
//---------------------server custom------------------
global.server_send_client_join_room = 'server.send.client.join.room';
global.server_send_question = 'server.send.question';
global.server_confirm_answer = 'server.confirm.answer';
global.server_send_listroom = 'server.send.listroom';
global.server_send_confirm_signup = 'server.send.confirm.signup';
global.server_send_record = 'server.send.record';
global.server_confirm_save_record = 'server.confirm.save.record';
global.server_confirm_login = 'server.confirm.login';
global.server_send_reconnect = 'server_send_reconnect';
//---------------------
global.server_to_room_send_question = 'server.to.room.send.question';
global.server_to_room_confirm_answer = 'server.to.room.confirm.answer';
global.server_to_room_send_finish_question = 'server.to.room.send.finish.question';
global.server_to_room_send_finish_match = 'server.to.room.send.finish.match';
global.server_to_room_confirm_ready = 'server.to.room.confirm.ready';
global.server_to_room_start_game = 'server.to.room.start.game';
global.server_to_room_client_leave = 'server.to.room.client.leave';
//----------------------SQL-----------------------------------------------
global.query_get_record = 'SELECT money, username FROM nine_record ORDER BY money DESC LIMIT 20';
global.query_get_right_answer = 'SELECT casea FROM `ninequestions` where id = ?';
global.query_get_record_user = 'select * from nine_record where username = ?';
global.query_set_record_user = 'insert into nine_record (username, money) values (?,?)';
global.query_update_record_user = 'update nine_record set money = ? where username = ?';
global.query_get_question_random = 'SELECT * FROM ninequestions where level = ? ORDER BY rand() LIMIT 1';
global.query_get_question_by_id = 'SELECT * FROM ninequestions where id = ?';
global.query_loginby_username_password = 'select * from nine_users where username = ? and password = ?';
global.query_set_user = 'insert into nine_users set ?';
global.query_get_user_by_username = 'select id from nine_users where username = ?';
