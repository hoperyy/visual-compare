var gulp = require('gulp');
var webpack = require('webpack');

var fs = require('fs');
var path = require('path');

var webpackConfig = require('./webpack.config');

gulp.task('start', function() {
	webpack(webpackConfig, function() {

		var bundlePath = path.join(__dirname, 'build/index.js');

		fs.readFile(bundlePath, function(err, buffer) {
			var content = buffer.toString();

			content = content.replace("for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];", "(typeof exports === 'object' ? exports : root)['VisualCompare'] = a;");

			fs.writeFileSync(bundlePath, content);
		});

    	
	});

});