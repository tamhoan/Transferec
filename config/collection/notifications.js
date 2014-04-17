/**
 * New node file
 */
module.exports = function(mongoose) {
	var notifiSchema = new mongoose.Schema({
		senderId: {type: mongoose.Schema.ObjectId, ref: 'User'},
		receiverId: {type: mongoose.Schema.ObjectId, ref: 'User'},
		notifiType: Number,
		content: String,
		seen: { type: Number, default: 0},
		createdOn: { type: Date, default: Date.now }
	});
	mongoose.model('Notification', notifiSchema);
};