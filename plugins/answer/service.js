var async = require('async');
var _ = require('lodash');
var UUID =require('uuid');
var seneca = require('seneca')();
var answerModel = require('./model.js').answerModel;
var audioSliceModel = require('./model.js').audioSliceModel;

module.exports = function(options){
	var seneca = this;

	seneca.teacherQueue = [];
	seneca.studentQueue = [];
	seneca.answers = {};

	seneca.add({role: 'answer', cmd: 'start'}, cmd_start);
	
	seneca.add({role: 'answer', cmd: 'createAnswer'}, cmd_createAnswer);
	seneca.add({role: 'answer', cmd: 'updateAnswer'}, cmd_updateAnswer);
	seneca.add({role: 'answer', cmd: 'getAnswer'}, cmd_getAnswer);
	seneca.add({role: 'answer', cmd: 'getAnswers'}, cmd_getAnswers);

	seneca.add({role: 'answer', cmd: 'save'})

	seneca.add({role: 'answer', cmd: 'addAudioSlice'}, cmd_addAudioSlice);
	seneca.add({role: 'answer', cmd: 'getAudioSlice'}, cmd_getAudioSlice);

	seneca.add({role: 'answer', cmd: 'enter_queue_message'}, cmd_enter_queue_message);
	seneca.add({role: 'answer', cmd: 'leave_queue_message'}, cmd_leave_queue_message);


	function cmd_start(args, callback){
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'answer', cmd: 'enter_queue_message', type: 'message', c: 'answer.enter_queue'
		}})
		seneca.act({role: 'keepAlive', cmd: 'register', data: {
			role: 'answer', cmd: 'leave_queue_message', type: 'message', c: 'answer.leave_queue'
		}})
		setInterval(_matchAnswer, 2000);
		callback(null, null);
	}

	function cmd_createAnswer(args, callback){
		var teacher = args.data.teacher;
		var student = args.data.student;
		var roomID = args.data.roomID;
		var answerID = args.data.answerID;
		var question = args.data.question;

		var answer = answerModel();
		answer.teacher = teacher;
		answer.student = student;
		answer.roomID = roomID;
		answer.answerID = answerID;
		answer.question = question;

		answer.save(function (err) {
			if (_.isEmpty(err)) {
				callback(null, { status: 'success' });
			} else {
				callback(null, { status: 'fail' });
			}
		})
	}

	function cmd_updateAnswer(args, callback) {
		answerModel
		.where(args.queryData)
		.update(args.updateData, function (err, result) {
			if ( result.ok > 0) {
				callback(null, { status: 'success' });
			} else {
				callback(null, { status: 'fail' });
			}
		});
	}

	function cmd_getAnswer(args, callback){
		answerModel
		.findOne(args.data, function (err, answer) {
			if (!_.isEmpty(answer)) {
				callback(null, { status: 'success', answer: answer });
			} else {
				callback(null, { status: 'fail' });
			}
		})
	}

	function cmd_getAnswers(args, callback){
		answerModel
		.find(args.data)
		.sort({created : 1})
		.exec(function (err, answers){
			if (!_.isEmpty(answers)) {
				callback(null, { status: 'success', answers: answers })
			} else {
				callback(null, null);
			}
		})

	}

	function cmd_addAudioSlice(args, callback){
		var answerID = args.data.answerID;
		var key = args.data.key;

		var audioSlice = new audioSliceModel();

		audioSlice.answerID = answerID;
		audioSlice.key = key;

		audioSlice.save(function (err) {
			if (_.isEmpty(err)) {
				callback(null, { status: 'success' });
			} else {
				callback(null, { status: 'fail' });
			}
		})
	}

	function cmd_getAudioSlice(args, callback){
		audioSliceModel
		.find(args.data)
		.sort({ key: 1 })
		.exec(function (err, slices){
			if (!_.isEmpty(slices)) {
				callback(null, { status: 'success', slices: slices})
			} else {
				callback(null, { status: 'fail' });
			}
		})		
	}

	function _matchAnswer(){
		var teacher, student;
		if (seneca.teacherQueue.length > 0 && seneca.studentQueue.length > 0) {
			teacher = seneca.teacherQueue.pop();
			student = seneca.studentQueue.pop();

			var answerID = UUID.v4().toString();

			async.waterfall([
				function (next) {
					seneca.act({role: 'room', cmd: 'schedule', data: {
						teacher: teacher.username, student: student.username, question: student.question, answerID: answerID
					}}, next)					
				}
			], function (err, result){
				if (result.status == 'success') {
					seneca.act({role: 'answer', cmd: 'createAnswer', data: {
						student: student.username,
						question: student.question,
						teacher: teacher.username, 
						answerID: answerID, 
						roomID: result.data.roomID
					}})

					seneca.act({role: 'keepAlive', cmd: 'broadcast', data: {
						tokens: [ teacher.token, student.token ],
						msg: {
							c: 'answer.match',
							data: {
								teacher: teacher.username,
								student: student.username,
								answerID: answerID,
								roomID: result.data.roomID
							}
						}
					}})					
				}
			})
		}
	}


	//老师进入队列，等待答疑，
	//学生进入队列，等待匹配老师
	//每次请求更新token，最后的页面接受通知
	function cmd_enter_queue_message(args, callback){
		var username = args.data.username;
		var role = args.data.role;
		var token = args.data.token;
		var question = args.data.question;

		//TODO 检查是否有进入队列的权限
		//如果已经在答疑中无法进入答疑队列
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
			seneca.studentQueue.push({ username: username, token: token, question: question })
		}

		callback(null, { status: 'success' });
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