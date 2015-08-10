var assert = require('assert');
var request = require('supertest');
var seneca = require('seneca')();

request = request('http://vgame.tv');
describe("Answer", function(){
	describe("#addAudioSlice", function(){
		it("ok", function (done){
			request
			.post('/api/answer/addAudioSlice')
			.send({ answerID: '2168761f-2307-4054-8fd2-5ae9c5f716e4', key: '123.jpg'})
			.end(function (err, res){
				console.log(res.body.code);
				done();
			})			
		})
	})


	// describe("#contcat audio slice", function (){
	// 	it("ok", function (done){
	// 		request
	// 		.post('/api/answer/concatAudioSlice')
	// 		.send({ answerID: '2168761f-2307-4054-8fd2-5ae9c5f716e4'})
	// 		.end(function (err, res){
	// 			console.log(res.body.code);
	// 			done();
	// 		})
	// 	})
	// })
})