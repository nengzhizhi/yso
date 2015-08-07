var seneca = require('seneca')();

module.exports = function(options){
	var seneca = this;

	seneca.teacherQueue = {};
	seneca.studentQueue = {};

	seneca.add({role: 'answer', cmd: 'start'}, cmd_start);
	seneca.add({role: 'answer', cmd: 'quene_message'}, cmd_queue_message);
	seneca.add({role: 'answer', cmd: 'match_message'}, cmd_match_message);


	function cmd_start(args, callback){
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'answer', cmd: 'quene_message', type: 'message', c: 'answer.queue'
		}})
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'answer', cmd: 'match_message', type: 'message', c: 'answer.match'
		}})
		setInterval(function(){
			//做一次调度匹配处理
		}, 1000);
		callback(null, null);
	}

	//老师进入队列，等待答疑，每次请求更新token，最后的页面接受通知
	function cmd_queue_message(args, callback){
		var username = args.data.username;
		var role = args.data.role;
		var token = args.data.token;

		if (role == 'teacher') {
			seneca.teacherQueue[username] = token;
		} else if (role == 'student') {
			seneca.teacherQueue[username] = token;
		}

		callback(null, null);
	}

	//学生进入匹配队列，定时处理队列
	function cmd_match_message(args, callback){
		var token = args.data.token;
		var username = args.data.username;
		var role = args.data.role;

		//if(hasPermission)
		seneca.studentQueue[token] = { username }
	}


	// function cmd_match_message(args, callback){
	// 	var token = args.data.token;
	// 	var tokens = [];
	// 	tokens.push(token);

	// 	for (var key in seneca.teacherQueue) {
	// 		tokens.push(seneca.teacherQueue[key]);
	// 		break;
	// 	}

	// 	seneca.act({role: 'keepAlive', cmd: 'broadcast', data: {
	// 		tokens: tokens,
	// 		msg: {
	// 			c: 'match',
	// 			data: {
	// 				teacher: 'teacher',
	// 				student: 'student',
	// 				roomID: 'xxxx-xxxx-xxxx'
	// 			}
	// 		}
	// 	}})

	// 	callback(null, null);
	// }
}