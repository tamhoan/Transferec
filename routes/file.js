/**
 * 
 */
var formidable = require('formidable'),
	fs = require('fs');
var mongoose = require('mongoose'),
	File = mongoose.model('File');

exports.getUpload = function(req, res) {
	var html = ''
		+ '<form method="post" action="/upfile" enctype="multipart/form-data">'
		+ '<p><input type="text" name="name" /></p>'
		+ '<p><input type="file" name="image" /></p>'
		+ '<p><input type="submit" value="Upload" /></p>'
		+ '</form>';
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', Buffer.byteLength(html));
		res.end(html);
};

exports.upload = function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname+'/upload';
	form.keepExtensions = true;
	var fileName;
	
	form.on('file', function(field, file){
		fs.rename(file.path, form.uploadDir + "/" + file.name);
		fileName = file.name;
	});
    form.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        request.resume();
    });
    form.on('aborted', function(err) {
        //console.log("user aborted upload");
    });
    form.on('end', function() {
        //console.log('-> upload done');
    	File.create({
    		name: fileName,
    		ownerId: req.session._id,
    	});
    });
    
	form.parse(req, function() {
        res.end("Success");
	});
};

exports.download = function(req, res) {
	var id = req.params.id;
	File.findById(id, function(err, file) {
		if(file) {
			var path = __dirname+'/upload/'+file.name;
			res.download(path, file.name);
		} else {
			res.statusCode = 404;
			res.send("Not Found File");
		}
	});
	//res.sendfile
};

exports.list = function(req, res) {
	File.find({}, function(err, files) {
		if(files) {
			res.json(files);
		}
	});
};