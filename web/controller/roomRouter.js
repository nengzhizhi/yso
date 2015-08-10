var express = require('express');
var request = require('request');
var roomRouter = express.Router();
var seneca = require('seneca')();

seneca.client({host: '127.0.0.1', port: 7003, pin: {role:'room',cmd:'*'}});

roomRouter.get('/get', function (req, res) {
	if (req.signedCookies) {
		var roomID = req.query.id;
		res.render('room/room_t', { room: {roomID: roomID }, user: req.signedCookies });
	} else {
		res.redirect('/users/login');
	}
});

roomRouter.get('/list', function (req, res) {
	seneca.act({role: 'room', cmd: 'list'}, function (err, result) {
		if (result.status == 'success') {
			res.render('room/list', { rooms: result.rooms, user: req.signedCookies });
		} else {
			res.render('common/error', { error: '获取房间列表失败！' })
		}
	})
})

module.exports = roomRouter;