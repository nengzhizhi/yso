var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var operationSchema = new Schema({
	aid: String,
	op: Array,
	t: Number
})

var answerSchema = new Schema({
	created: { type: Date, default: Date.now },
	teacher: String,
	student: String,
	audio: String,
	savingStatus:  { type:String, required: false, default: 'waiting'},
	answerID: String,
	roomID: String,
	question: {
		imgUrl: String,
		subject: String,
		grade: String
	}
});

var audioSliceSchema = new Schema({
	answerID: String,
	key: String,
	status: { type:String, required: false, default: 'alone'},
	created: { type: Date, default: Date.now }
})

exports.operationModel = mongoose.model('operation', operationSchema);
exports.answerModel = mongoose.model('answer', answerSchema);
exports.audioSliceModel = mongoose.model('audioSlice', audioSliceSchema);