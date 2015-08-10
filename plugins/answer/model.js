var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var answerSchema = new Schema({
	created: { type: Date, default: Date.now },
	teacher: String,
	student: String,
	audio: String,
	savingStatus:  { type:String, required: false, default: 'waiting'},
	imgUrl: String,
	answerID: String,
	roomID: String
});

var audioSliceSchema = new Schema({
	answerID: String,
	key: String,
	status: { type:String, required: false, default: 'alone'},
	created: { type: Date, default: Date.now }
})

exports.answerModel = mongoose.model('answer', answerSchema);
exports.audioSliceModel = mongoose.model('audioSlice', audioSliceSchema);