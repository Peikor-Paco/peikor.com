//Packages
let   gulp = require('gulp');
      sass = require('gulp-sass');
      sourcemaps = require('gulp-sourcemaps');
      plumber = require('gulp-plumber');
      imagemin = require('gulp-imagemin');
      mozjpeg = require("mozjpeg");

      gutil = require('gulp-util');
      notify = require('gulp-notify');
      beep = require('beepbeep');
      pxtorem = require("gulp-pxtorem");

      htmlbeautify = require('gulp-html-beautify');
      handlebars = require('handlebars');
      handlebarsLayouts = require('handlebars-layouts');
      handlebarsHtml = require('gulp-handlebars-html')(handlebars);
      repeat = require("handlebars-helper-repeat");
      handlebars.registerHelper("repeat", repeat);

      bulkSass = require('gulp-sass-bulk-import');
      postcss = require('gulp-postcss');
      autoprefixer = require('gulp-autoprefixer');
      
      uglify = require('gulp-uglify');
      concat = require('gulp-concat');
      pump = require('pump');

      browserSync = require('browser-sync').create();
      reload = browserSync.reload;
      config = {
        assetSelector: ''
      };

const AUTOPREFIXER_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10"
];

//Syncronize changes
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
});


//Compile Sass
gulp.task(
  "sass",
  gulp.series(function (done) {
    gulp
      .src("./app/scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(bulkSass())
      .pipe(
        sass({
          outputStyle: "compressed",
          precision: 10,
          includePaths: ["app/scss"],
        }).on("error", sass.logError)
      )
      .pipe(
        pxtorem({
          rootValue: 16,
          unitPrecision: 5,
          propList: [
            "font",
            "font-size",
            "line-height",
            "letter-spacing",
            "padding",
            "padding*",
            "margin*",
          ],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
        })
      )
      .pipe(autoprefixer({ overrideBrowserslist: AUTOPREFIXER_BROWSERS }))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("./dist/css"))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      );
    done();
  })
);
// Compile Handlebars
gulp.task('html', () => {
  'use strict';
  handlebars.registerHelper(handlebarsLayouts(handlebars));
  return gulp
    .src("./app/templates/pages/*.html")
    .pipe(
      handlebarsHtml(
        {
          assetSelector: config.assetSelector
        },
        {
          ignorePartials: true,
          partialsDirectory: ["./app/templates/partials"]
        }
      )
    )
    .pipe(htmlbeautify())
    .pipe(gulp.dest("./dist/"));
});

// Build lib 3rd-party styles, pluggin

gulp.task('js:libraries', function() {
    'use strict';
    return gulp.src([
      'app/js/vendor/**/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('libraries.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      compress: true,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'));
});

// Minimimaize umage
gulp.task('imagemin', function() {
  gulp
    .src("./app/img/**/*.{jpg,jpeg,png,gif,svg}")
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest("./dist/img"));
});


gulp.task('watch', function () {
    gulp.watch("app/scss/**/*.scss", gulp.series("sass"));
    gulp.watch("app/templates/**/*.html", gulp.series("html"));
    gulp.watch("dist/*.html").on("change", browserSync.reload);
    gulp.watch("app/img/**/*.{jpg,jpeg,png,gif}", gulp.series("imagemin"));
    gulp.watch("app/js/**/*.js", gulp.series("js:libraries"));
  }
);

gulp.task("default", gulp.parallel("watch", "browser-sync"));