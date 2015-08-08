module.exports = function(options){
	var seneca = this;
	var router = seneca.export('web/httprouter');

	seneca.act('role:web', {use: router(function (app) {
		app.get('/api/room/get', onGetRoom);
		app.get('/api/room/list', onListRoom);
	})})

	seneca.use('/plugins/room/service');

	function onGetRoom(req, res){
		res.end(JSON.stringify({
			code: 200, data: { roomID: 'xxxx-xxxx' }
		}));
	}

	function onListRoom(req, res){
		
	}
}