/**
 * New node file
 */
module.exports = function(mongoose) {
	var userSchema = new mongoose.Schema({
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		status: Number,
		createdOn: { type: Date, default: Date.now }
	});
	mongoose.model('User', userSchema);
}