/**
 * New node file
 */
module.exports = function(mongoose) {
	var fileSchema = new mongoose.Schema({
		name: {type: String, required: true},
		ownerId: {type: mongoose.Schema.ObjectId, ref: 'User'},
		description: String,
		//fileType: {type: Number, require: true},
		createdOn: { type: Date, default: Date.now }
	});
	mongoose.model('File', fileSchema);
};