var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var less = require('gulp-less');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');
var replace = require('gulp-string-replace');
var config = require('./app/config.js');
var es6transpiler = require('gulp-es6-transpiler');

/* Available tasks

 gulp compile_less - compile main stylesheet (app.min.css)
 gulp less:watch - autocompile *.less when have changes

 gulp common_scripts - common scripts/plugins used in template
 gulp app_js - concatenate/minify /app (without /app/bower_components) files (app.min.js) in /build folder

 gulp copy_files - copy needed files from /app to /_dist

 */

gulp.task('common_scripts', function () {
    return gulp.src([
            "app/bower_components/angular/angular.js",
            "app/bower_components/angular-sanitize/angular-sanitize.js",
            "app/bower_components/angular-route/angular-route.js",
            "app/bower_components/angular-loader/angular-loader.js",

            "app/bower_components/angular-translate/angular-translate.js",
            "app/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js",

            "app/bower_components/tinymce/tinymce.js",
            "app/bower_components/angular-ui-tinymce/src/tinymce.js",

            "app/bower_components/angular-tooltips/dist/angular-tooltips.js",

            "app/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",

            "app/bower_components/alertifyjs/dist/js/alertify.js",
            "app/bower_components/alertifyjs/dist/js/ngAlertify.js",

            "app/bower_components/angular-dragula/dist/angular-dragula.js",
            "app/bower_components/a0-angular-storage/dist/angular-storage.js",
            "app/bower_components/angular-jwt/dist/angular-jwt.js",
            "app/bower_components/angular-animate/angular-animate.js",
            "app/bower_components/angular-aria/angular-aria.js",
            "app/bower_components/angular-material/angular-material.js",
            "app/bower_components/angular-messages/angular-messages.js",
            "app/bower_components/angular-mocks/angular-mocks.js",
            "app/bower_components/dropzone/dist/min/dropzone.min.js",
            "app/bower_components/ng-dropzone/dist/ng-dropzone.min.js"
        ])
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/'));
});

gulp.task('compile_less', function () {
    return gulp.src(`app/${config.layoutsPath}/${config.defaultLayout}/_${config.defaultSkin}-theme.less`)
        .pipe(concat('app.css'))
        .pipe(less())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./app/'))
});

gulp.task('compile_concat', function() {
    return gulp.src([
        "app/bower_components/angular-material/angular-material.min.css",
        "app/bower_components/dropzone/dist/min/dropzone.min.css",
        "app/bower_components/ng-dropzone/dist/ng-dropzone.min.css", 
        "app/app.min.css"])
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./app/'))
});

gulp.task('less:watch', function () {
    gulp.watch([`app/${config.layoutsPath}/${config.defaultLayout}/*.less`, 'app/*.less', 'app/md/*.less'], ['compile_less']);
});

gulp.task('copy_tinymce', function () {
    return gulp.src('app/bower_components/tinymce/**/*', {
            "base": "./app"
        })
        .pipe(gulp.dest(config.buildFolder));
})

gulp.task('replace', function () {
    return gulp.src('./app/index.html')
        .pipe(replace(new RegExp('@builderTitle@|@UA@|@builderDescription@', 'g'), function (rep) {
            return config[rep.replace(/@/gi, '')];
        }))
        .pipe(gulp.dest(config.buildFolder));
})

gulp.task('copy_files', function () {
    return gulp.src([
            'app/**',
            '!app/{bower_components,bower_components/**,**/*.less,app.js,config.js,directives/*.js,container/*.js,filters/*.js,auth/*.js,index.html,md,md/**}',
        ], {
            "base": "./app"
        })
        .pipe(gulp.dest(`_dist`));
});

gulp.task('app_js', function () {
    return gulp.src([
            'app/config.js',
            'app/app.js',
            'app/directives/builder/media-upload/element.js',
            'app/directives/builder/builder.js',
            'app/directives/sidebar/list/list.js',
            'app/directives/sidebar/samples/element.js',
            'app/directives/sidebar/object-email/element.js',
            'app/directives/sidebar/sidebar.js',
            'app/directives/navbar/navbar.js',
            'app/container/container.js',
            'app/auth/auth.js',
            'app/filters/name.js'
        ]).pipe(concat('app.min.js'))
        .pipe(es6transpiler({
            disallowUnknownReferences: false
        }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(config.buildFolder))
});

gulp.task('add_app_min', function () {
    var target = gulp.src(config.buildFolder + '/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(config.buildFolder + '/app.min.js', {
        read: false
    });

    return target.pipe(inject(sources, {
            ignorePath: config.buildFolder,
            addRootSlash: false,
            relative: false
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.buildFolder));
});

gulp.task('default', function () {
    return runSequence(['common_scripts', 'compile_less', 'compile_concat', 'replace'], ['copy_tinymce', 'copy_files'], 'app_js', 'add_app_min');
})