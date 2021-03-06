const autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const minifyCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const shell = require('gulp-shell');
const plumber = require('gulp-plumber');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');

gulp.task('browserSync', () => {
	browserSync({
		server: {
			baseDir: './dist/',
		},
		notify: false,
	});
});

gulp.task('images', () => {
	return gulp.src(['app/images/**/*'])
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest('./dist/images/'));
});

gulp.task('images-deploy', () => {
	return gulp.src(['app/images/**/*', '!app/images/README'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/images/'));
});

gulp.task('scripts', () => {
	return browserify(['app/scripts/app.js'])
		.bundle()
		.pipe(source('app.js'))
		.pipe(plumber())
		.on('error', console.error)
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts-deploy', () => {
	return browserify(['app/scripts/app.js'])
		.bundle()
		.pipe(source('app.js'))
		.pipe(plumber())
		.pipe(gulp.dest('./dist/scripts'));
});

gulp.task('scripts-deploy-babel', () => {
	return gulp.src('./dist/scripts/app.js')
		.pipe(babel({
			presets: ['env'],
		}))
		.pipe(gulp.dest(file => file.base));
});

gulp.task('scripts-deploy-end', () => {
	return gulp.src(['./dist/scripts/app.js'])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(file => file.base));
});

gulp.task('styles', () => {
	return gulp.src('app/styles/main.scss')
		.pipe(plumber({
			errorHandler: (err) => {
				console.log(err);
				this.emit('end');
			},
		}))
		.pipe(sourceMaps.init())
		.pipe(sass({
			errLogToConsole: true,
			includePaths: [
				'app/styles/',
			],
		}))
		.pipe(autoprefixer({
			browsers: autoPrefixBrowserList,
			cascade: true,
		}))
		.on('error', console.error)
		.pipe(concat('styles.css'))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles-deploy', () => {
	return gulp.src('app/styles/main.scss')
		.pipe(plumber())
		.pipe(sass({
			includePaths: [
				'app/styles/',
			],
		}))
		.pipe(autoprefixer({
			cascade: true,
		}))
		.pipe(concat('styles.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/styles'));
});

gulp.task('html', () => {
	return gulp.src('app/*.html')
		.pipe(plumber())
		.pipe(browserSync.reload({ stream: true }))
		.on('error', console.error);
});

gulp.task('html-deploy', () => {
	gulp.src('app/**/*.html')
		.pipe(plumber())
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean', shell.task('rm -rf ./dist/'));

gulp.task('scaffold', () => {
	return gulp.src('./')
		.pipe(shell([
			'mkdir dist dist/fonts dist/images dist/scripts dist/styles',
		]));
});

gulp.task('default', ['browserSync', 'scripts', 'styles', 'html-deploy', 'images'], () => {
	gulp.watch('app/scripts/**', ['scripts']);
	gulp.watch('app/styles/**', ['styles']);
	gulp.watch('app/images/**', ['images']);
	gulp.watch('app/*.html', ['html', 'html-deploy']);
});

gulp.task('deploy', () => {
	runSequence(
		'clean',
		'scaffold',
		'scripts-deploy',
		'scripts-deploy-babel',
		'scripts-deploy-end',
		'styles-deploy',
		'images-deploy',
		'html-deploy',
	);
});
