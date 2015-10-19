var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var inlinesource = require('gulp-inline-source');
//var less = require('gulp-less');
//var minifyCSS = require('gulp-minify-css');
//var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
//var karma = require('karma');

var distPath = function (p) {
    return './dist/' + (p || '');
};

gulp.task('clean-less', function () {
    return gulp.src([
        distPath('app.css'),
        distPath('app.min.css'),
        distPath('app.min.css.map')
    ], {
        read: false
    })
    .pipe(vinylPaths(del));
});


function buildLess(configuration) {
    return function() {
        var minify = configuration !== "debug";
        return gulp.src([
                'app/app.less'
            ])
            .pipe(minify ? sourcemaps.init() : gutil.noop())
            .pipe(less())
            .on('error', swallowError)
            .pipe(gulp.dest(distPath()))
            .on('error', swallowError)
            .pipe(minify ? minifyCSS() : gutil.noop())
            .on('error', swallowError)
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(distPath()))
            .pipe(minify ? sourcemaps.write('.') : gutil.noop())
            .on('error', swallowError)
            .pipe(gulp.dest(distPath()));
    }
}
gulp.task('build-debug-less', ['clean-less'], buildLess('debug'));
gulp.task('build-release-less', ['clean-less'], buildLess('release'));


gulp.task('clean-html', function () {
    return gulp.src([
        distPath('app.templates.js'),
        distPath('app.templates.min.js'),
        distPath('app.templates.min.js.map')
    ], {
        read: false
    })
    .pipe(vinylPaths(del));
});

gulp.task('build-html', ['clean-html'], function () {
    return gulp.src('app/**/*.html')
        .on('error', swallowError)
        .pipe(templateCache({
            filename: 'app.templates.js',
            root: 'app/',
            module: 'app'
        }))
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(distPath()))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPath()))
        .pipe(sourcemaps.write('.'))
        .on('error', swallowError)
        .pipe(gulp.dest(distPath()));
});

// Bower package "normalize-css" has not been minified.
gulp.task('minify-normalize-css', function () {
    return gulp.src('bower_components/normalize-css/normalize.css')
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('bower_components/normalize-css/'));
});

gulp.task('clean-js', function () {
    return gulp.src([
        distPath('app.js'),
        distPath('app.min.js'),
        distPath('app.min.js.map')
    ], {
        read: false
    })
    .pipe(vinylPaths(del));
});

function buildJavaScript(configuration) {
    return function () {
        //var minify = configuration !== "debug";
        var minify = false;
        return gulp.src([
            'app/**/*.module.js',
            'app/**/*.js',
            //'!app/app.config.!('+configuration+').js'
        ])
            .pipe(minify ? sourcemaps.init() : gutil.noop())
            .on('error', swallowError)
            .pipe(concat('app.js'))
            .on('error', swallowError)
            .pipe(gulp.dest(distPath()))
            .pipe(minify ? uglify() : gutil.noop())
            .on('error', swallowError)
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(distPath()))
            .pipe(minify ? sourcemaps.write('.') : gutil.noop())
            .on('error', swallowError)
            .pipe(gulp.dest(distPath()));
    }
}

gulp.task('build-debug-js', ['clean-js'], buildJavaScript('debug'));
gulp.task('build-release-js', ['clean-js'], buildJavaScript('release'));

function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('watch', function () {
    gulp.watch([
        //'app/**/*.less',
        'app/**/*.html',
        'app/**/*.js'
    ], ['default']);
});

gulp.task('watch-less', function () {
    gulp.watch([
        'app/**/*.less'
    ], ['build-debug-less']);
});

gulp.task('watch-html', function () {
    gulp.watch([
        'app/**/*.html'
    ], ['build-html']);
});

gulp.task('watch-js', function () {
    gulp.watch([
        'app/**/*.js'
    ], ['build-debug-js']);
});

gulp.task('copy-fonts', function () {
    return gulp.src('./bower_components/fontawesome/fonts/*')
        .pipe(gulp.dest(distPath('fonts/')));
});

gulp.task('copy-graphics', function () {
    return gulp.src('./graphics/*')
        .pipe(gulp.dest(distPath('graphics/')));
});

gulp.task('build-index', function () {
    return gulp.src('index.html')
        .pipe(inlinesource({
            rootpath: './'
        }))
        .pipe(gulp.dest(distPath()));
});

gulp.task('unit-test', function (done) {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch-unit-test', function () {
    gulp.watch([
        'test/**/*.spec.js'
    ], ['unit-test']);
});

gulp.task('debug', gulpsync.sync([
    //'minify-normalize-css',
    //'copy-fonts',
    //'copy-graphics',
    //'build-debug-less',
    'build-html',
    'build-debug-js'
]));

gulp.task('release', gulpsync.sync([
    'minify-normalize-css',
    'copy-fonts',
    'copy-graphics',
    'build-release-less',
    'build-html',
    'build-release-js',
    'build-index',
    'build-form-preview-js',
    'build-form-preview-index'
]));

gulp.task('default', gulpsync.sync([
    'debug'
]));
