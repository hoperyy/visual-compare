var gulp = require('gulp');
var uglify = require('gulp-uglify')
var webpack = require('webpack');

var fs = require('fs');
var path = require('path');

var webpackConfig = require('./webpack.config');

gulp.task('start', function() {
	webpack(webpackConfig, function() {

		var bundlePath = path.join(__dirname, 'dist/visual-compare.js');

		fs.readFile(bundlePath, function(err, buffer) {
			var content = buffer.toString();

			content = content.replace("for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];", "(typeof exports === 'object' ? exports : root)['VisualCompare'] = a;");

			fs.writeFileSync(bundlePath, content);

			gulp.src(bundlePath).pipe(uglify()).pipe(gulp.dest(path.join(__dirname, 'dist')));

		});

    	
	});

});