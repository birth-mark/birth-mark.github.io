var gulp = require("gulp");
var pug = require("gulp-pug");
var sass = require("gulp-sass");
var minify = require('gulp-minifier');
var babel = require('gulp-babel')

// default
gulp.task('default', ['sass', 'pug'], () => console.log('it is gulp file'));

gulp.task('sass', () =>  gulp.src('styles/**/*.scss')
	.pipe(sass().on('erorr', sass.logError))
	.pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  }))
	.pipe(gulp.dest('./birth-mark.github.io/css'))
);

gulp.task('pug', () => gulp.src('templates/**/*.pug')
	.pipe(pug({
		pretty:true
	})).on('erorr', () => console.log(arguments))
	.pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  }))
	.pipe(gulp.dest('./birth-mark.github.io'))
);
gulp.task('script', () => gulp.src('rout/**/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('./birth-mark.github.io'))
);
gulp.task('w', ['sass'], function() {
	gulp.watch('styles/*.scss', ['sass']);
});
gulp.task('pugw', ['pug'], () => gulp.watch('templates/**/*.pug', ['pug']) );

gulp.task('s', ['w', 'pugw', 'script'], function(){
	require('./index');
});
