var syntax = 'sass'; // Syntax: sass or scss;

var 	gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		clean 			= require('gulp-clean'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require("gulp-notify"),
		svgmin			= require('gulp-svgmin'),
		svgSprite	   = require('gulp-svg-sprite'),
		cheerio		   = require('gulp-cheerio'),
		rigger	 	   = require('gulp-rigger'),
		imagemin       = require('gulp-imagemin'),
		pngquant	   	= require('imagemin-pngquant'),
		watch		   	= require('gulp-watch'),
		reload		   = browserSync.reload;

var path = {
   build: { 
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		pic: 'dist/pic/',
		fonts: 'dist/fonts/',
	},
	src: {
		html: 'app/*.html',
		js: 'app/js/scripts.min.js',	//only 'main' files
		style: 'app/sass/main.sass',
		img: ['app/img/**/*.jpg', 'app/img/**/*.jpeg', 'app/img/**/*.png','app/img/**/*.ico'],
		pic: 'app/pic/**/*.*',
		fonts: 'app/fonts/**/*.*',
		svg: 'app/img/svg-sprite/'
	},
	watch: { 
		html: 'app/**/*.html',
		js: 'app/js/**/*.js',
		style: 'app/sass/**/*.sass',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*',
	},
   clean: 'dist', 
   outputDir: 'dist' 
 };

 var config = {
	server: {
		baseDir: "dist"
	},
	tunnel: false,
	host: 'localhost',
	port: 3000,
	logPrefix: "frontend_alex"
};

gulp.task('webserver', function() {
	browserSync(config)
});

gulp.task('html', function() {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/bootstrap/js/bootstrap.js',
		'app/libs/fancybox/dist/jquery.fancybox.min.js',
		'app/libs/maskedInput/maskedInput.min.js',
		'app/libs/mCustomScrollbar/jquery.mCustomScrollbar.concat.min.js',
		'app/js/common.js',
		])
	.pipe(concat('scripts.min.js'))
	//.pipe(uglify()) // minify all js (optional)
	.pipe(gulp.dest(path.build.js))
	.pipe(reload({stream: true}));
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // opt., comments out when debugging
	.pipe(gulp.dest(path.build.css))
	.pipe(reload({stream: true}));
});

gulp.task('images', function() {
	return gulp.src(path.src.img)
	// .pipe(cache(imagemin())) // Cache Images
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewvBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({stream: true})); 
});

gulp.task('pic', function() {
	return gulp.src(path.src.pic)
	// .pipe(cache(imagemin())) // Cache Images
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewvBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.pic))
	.pipe(reload({stream: true})); 
});

gulp.task('fonts', function() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('cleanSvgFolder', function() {
	return gulp.src(path.src.svg, {read: false})
		.pipe(clean());
});

// Remove fills and styles from SVG icons
gulp.task('removeFill', ['cleanSvgFolder'], function() {
	return gulp.src('app/img/svg-icons/*.svg')
		.pipe(cheerio({
			run: function($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(gulp.dest(path.src.svg));
});

gulp.task('svg-sprite', ['removeFill'], function() {
	return gulp.src(['app/img/svg-img/*.svg', path.src.svg+'/*.svg'])
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg', 
				}
			}
		}))
		.pipe(gulp.dest(path.build.img));
});


gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('images');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts');
	});
});

gulp.task('watch', ['html', 'styles', 'js', 'images', 'pic', 'svg-sprite', 'fonts', 'webserver'], function() {
	gulp.watch(['app/'+syntax+'/**/*.'+syntax+''], ['styles']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch(['app/img/*', '!app/img/**/*.svg'], ['images']);
	gulp.watch('app/pic/**/*.*', ['pic']);
	gulp.watch('app/img/svg-icons/*.svg', ['svg-sprite']);
	gulp.watch('app/fonts/*', ['fonts']);
});

gulp.task('default', ['watch']);
