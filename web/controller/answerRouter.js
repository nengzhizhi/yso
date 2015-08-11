var async = require('async');
var request = require('request');
var express = require('express');
var answerRouter = express.Router();
var _ = require('lodash');

var RestApi = {
	getAnswers : 'http://vgame.tv/api/answer/getAnswers'
};

answerRouter.get('/answers', function (req, res) {
	request.post({
		url : RestApi.getAnswers,
		headers : { Cookie : req.headers.cookie }
	},function (err, response, body){
		if(response.statusCode == 200) {
			var result = body ? JSON.parse(body) : {};

			res.render('answer/answers', { answers: result.data.answers, user: req.signedCookies });
		}
	})	
})

module.exports = answerRouter;