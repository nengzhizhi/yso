var express = require('express');
var request = require('request');
var tempRouter = express.Router();
var seneca = require('seneca')();


tempRouter.get('/home/s', function (req, res) {
	res.render('users/home_s');
})

tempRouter.get('/home/t', function (req, res) {
	res.render('users/home_t');
})

tempRouter.get('/room/t', function (req, res) {
	res.render('room/room_t');
})

tempRouter.get('/room/s', function (req, res) {
	res.render('room/room_s');
})

module.exports = tempRouter;