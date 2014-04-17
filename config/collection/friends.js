/**
 * New node file
 */
module.exports = function(mongoose) {
	var friendSchema = new mongoose.Schema({
		user1: {type: mongoose.Schema.ObjectId, ref: 'User'},
		user2: {type: mongoose.Schema.ObjectId, ref: 'User'},
		//createdOn: { type: Date, default: Date.now }
	});
	mongoose.model('Friend', friendSchema);
};