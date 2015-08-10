"undefined" === typeof config && (config = {});
(function(c){
	c.wsServerIP = 'vgame.tv';
	c.wsServerPort = 10001;
	c.wsServerProtocol = 'echo-protocol';
	c.uploadTokenUrl = "http://vgame.tv/api/answer/uploadToken";
	c.addAudioSliceUrl = "http://vgame.tv/api/answer/addAudioSlice";
})(config);