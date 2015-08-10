var qiniu = require('qiniu');
var http = require('http');

module.exports = function(options){
	var seneca = this;
	var router = seneca.export('web/httprouter');

	qiniu.conf.ACCESS_KEY = 'zQKgGIPr-OBfpGn82vgqGF8iPeZO6qwO9LMtaJsk';
	qiniu.conf.SECRET_KEY = '5FFoL8KBg-9l1AMEoaXIuIjKbqYlgn0eJ_y7LNhn';	

	seneca.act('role:web', { use: router(function (app) {
		app.get('/api/answer/uploadToken', onUploadToken);
		app.post('/api/answer/addAudioSlice', onAddAudioSlice);
		app.post('/api/answer/concatAudioSlice', onConcatAudioSlice);
		app.post('/api/answer/concatCallback', onConcatCallback);
	})})

	function onUploadToken(req, res){
		//TODO if(req.query.type == 'image')
		//TODO if(req.query.type == 'sound')

		var putPolicy = new qiniu.rs.PutPolicy('sounds');
		//token的有效时间
		putPolicy.deadline = Date.now()/1000 + 720000;
		//putPolicy.expires = 60;
		res.end(JSON.stringify({'uptoken':putPolicy.token()}));		
	}

	function onAddAudioSlice(req, res){
		//TODO check input

		seneca.act({
			role: 'answer', 
			cmd: 'addAudioSlice', 
			data: {
				key: req.body.key,
				answerID: req.body.answerID
			}
		}, function (err, result) {
			if(result && result.status == 'success') {
				res.end(JSON.stringify({ code: 200 }));
			} else {
				//FIXME
				res.end(JSON.stringify({ code: 201 }))
			}
		})
	}

	function onConcatAudioSlice(req, res){
		//TODO check input
		var answerID = req.body.answerID;
	}

	function onConcatCallback(req, res){
	}

	function _qiniuConcat(slices, notifyURL, callback){
		//TODO 在配置文件或者配置服务中读取
		var spacename = 'sounds';
		var prefix = 'http://7xkjiu.media1.z0.glb.clouddn.com/';
		var ACCESS_KEY = 'zQKgGIPr-OBfpGn82vgqGF8iPeZO6qwO9LMtaJsk';
		var SECRET_KEY = '5FFoL8KBg-9l1AMEoaXIuIjKbqYlgn0eJ_y7LNhn';
		var pipeline = 'soundsConcat';

		qiniu.conf.ACCESS_KEY = ACCESS_KEY;
		qiniu.conf.SECRET_KEY = SECRET_KEY;

		var concat_fops = 'avconcat/2/format/mp3';
		for (var i = 1; i < slices.length; i++) {
			concat_fops = concat_fops + '/' + qiniu.util.urlsafeBase64Encode(prefix + slices[i].key);
		}

		var ops = { 
			pipeline: pipeline,
			notifyURL: notifyURL
		};

		qiniu.fop.pfop(
			spacename, 
			slices[0].key, 
			concat_fops, 
			ops, 
			function (err, result, response){
				if (_.isEmpty(err) && response.statusCode == 200) {
					callback(null, { status: 'success' });
				} else {
					callback(null, err);
				}
			}
		)		
	}	
}