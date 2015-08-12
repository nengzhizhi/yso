var assert = require('assert');
var request = require('supertest');
var seneca = require('seneca')();
var mongoose = require('mongoose');

seneca.use('../../plugins/answer/service');
mongoose.connect('mongodb://yousi:password@112.124.117.146:27017/yousi');

// request = request('http://vgame.tv');
// describe("Answer", function(){
// 	// describe("#addAudioSlice", function(){
// 	// 	it("ok", function (done){
// 	// 		request
// 	// 		.post('/api/answer/addAudioSlice')
// 	// 		.send({ answerID: '2168761f-2307-4054-8fd2-5ae9c5f716e4', key: '123.jpg'})
// 	// 		.end(function (err, res){
// 	// 			console.log(res.body.code);
// 	// 			done();
// 	// 		})			
// 	// 	})
// 	// })


// 	// describe("#contcat audio slice", function (){
// 	// 	it("ok", function (done){
// 	// 		request
// 	// 		.post('/api/answer/concatAudioSlice')
// 	// 		.send({ answerID: '2168761f-2307-4054-8fd2-5ae9c5f716e4'})
// 	// 		.end(function (err, res){
// 	// 			console.log(res.body.code);
// 	// 			done();
// 	// 		})
// 	// 	})
// 	// })
// })

describe("Answer", function(){
	// describe("#save operations", function(){
	// 	it("ok", function (done) {
	// 		seneca.act({
	// 			role: 'answer', 
	// 			cmd: 'save_operation_message', 
	// 			data: {
	// 				answerID: 'xxxxx',
	// 				op: ['xxxx'],
	// 				t: Date.now()
	// 			}
	// 		}, function (err, result) {
	// 			console.log(result);
	// 			done();
	// 		})
	// 	})
	// })

	describe("#get operations", function (){
		it("OK", function (done) {
			seneca.act({
				role: 'answer',
				cmd: 'getOperations',
				data: { answerID: 'xxxxx' }
			}, function (err, result) {
				console.log(result);
				done();
			})
		})
	})
})