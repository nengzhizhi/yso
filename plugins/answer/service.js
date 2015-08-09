var async = require('async');
var seneca = require('seneca')();

module.exports = function(options){
	var seneca = this;

	seneca.teacherQueue = [];
	seneca.studentQueue = [];

	seneca.add({role: 'answer', cmd: 'start'}, cmd_start);
	seneca.add({role: 'answer', cmd: 'enter_queue_message'}, cmd_enter_queue_message);
	seneca.add({role: 'answer', cmd: 'leave_queue_message'}, cmd_leave_queue_message);


	function cmd_start(args, callback){
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'answer', cmd: 'enter_queue_message', type: 'message', c: 'answer.enter_queue'
		}})
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'answer', cmd: 'levae_queue_message', type: 'message', c: 'answer.leave_queue'
		}})
		setInterval(_matchAnswer, 2000);
		callback(null, null);
	}

	function _matchAnswer(){
		var teacher, student;
		if (seneca.teacherQueue.length > 0 && seneca.studentQueue.length > 0) {
			teacher = seneca.teacherQueue.pop();
			student = seneca.studentQueue.pop();
			//FIXME
			var answerID = 'xxxx-xxxx-xxxx-xxxx';

			async.waterfall([
				function (next) {
					seneca.act({role: 'room', cmd: 'schedule', data: {
						teacher: teacher.username, student: student.username, answerID: answerID
					}}, next)					
				}
			], function (err, result){
				if (result.status == 'success') {
					seneca.act({role: 'keepAlive', cmd: 'broadcast', data: {
						tokens: [ teacher.token, student.token ],
						msg: {
							c: 'answer.match',
							data: {
								teacher: teacher.username,
								student: student.username,
								answerID: answerID
							}
						}
					}})					
				}
			})
			console.log(teacher, student);
		}
	}


	//老师进入队列，等待答疑，
	//学生进入队列，等待匹配老师
	//每次请求更新token，最后的页面接受通知
	function cmd_enter_queue_message(args, callback){
		var username = args.data.username;
		var role = args.data.role;
		var token = args.data.token;

		if (role == 'teacher') {
			for (var key in seneca.teacherQueue) {
				if (seneca.teacherQueue[key].username == username) {
					seneca.teacherQueue.splice(key, 1);
				}
			}
			seneca.teacherQueue.push({ username: username, token: token })
		} else if (role == 'student') {
			for (var key in seneca.studentQueue) {
				if (seneca.studentQueue[key].username == username) {
					seneca.studentQueue.splice(key, 1);
				}
			}
			seneca.studentQueue.push({ username: username, token: token })
		}

		callback(null, null);
	}

	function cmd_leave_queue_message(args, callback){
		var token = args.data.token;
		var username = args.data.username;
		var role = args.data.role;

		if (role=='teacher' && !_.isEmpty(seneca.teacherQueue[username])) {
			delete seneca.teacherQueue[username];
		} else if (role=='student' && !_.isEmpty(seneca.studentQueue[username])) {
			delete seneca.studentQueue[username];
		}
	}
}