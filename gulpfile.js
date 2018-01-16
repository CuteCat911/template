"use strict"

const conf = {
  default: {
    gulp: require("gulp"),
    browserSync: require("browser-sync"),
    notify: require("gulp-notify"),
    rename: require("gulp-rename"),
    merge: require("merge-stream")
  },
  css: {
    stylus: require("gulp-stylus"),
    autoprefixer: require("gulp-autoprefixer"),
    sourceMaps: require("gulp-sourcemaps"),
    cssNano: require("gulp-cssnano"),
    concat: require("gulp-concat")
  },
  html: {
    pug: require("gulp-pug")
  },
  js: {
    webpackStream: require("webpack-stream"),
    named: require("vinyl-named"),
    uglify: require("gulp-uglify"),
    uglifyWebpack: require("uglifyjs-webpack-plugin")
  },
  svg: {
    sprite: require("gulp-svg-sprite"),
    plumber: require("gulp-plumber"),
    cheerio: require("gulp-cheerio"),
    replace: require("gulp-replace")
  },
  img: {
    sprite: require("gulp.spritesmith")
  }
};
const NODE_ENV = process.env.NODE_ENV || "dev";
const webpack = conf.js.webpackStream.webpack;
const gulp = conf.default.gulp;
const webpackOptions = {
  output: {
    publicPath: "/js",
    library: "[name]"
  },
  watch: true,
  devtool: "cheap-inline-module-source-map",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      minChunks: 4
    }),
    new conf.js.uglifyWebpack()
  ]
};
const funcs = {
  reloadStream: function(params) {
    if (params && typeof params === "object") {
      params.pipe(conf.default.browserSync.reload({stream: true}));
    }
  },
  applyTasks: function(tasks) {
    if (tasks && typeof tasks === "object") {
      for (let i in tasks) {
        if (tasks[i] && typeof tasks[i] === "function") {
          if (i == "normal") {
            gulp.task(i, ["localhost", "pages", "stylus", "cssLibs", "scripts", "scriptsLibs", "svg", "img"], tasks[i]);
          } else if (i == "without") {
            gulp.task(i, ["localhost", "pages", "stylus", "cssLibs", "svg", "img"], tasks[i]);
          } else if (i == "only") {
            gulp.task(i, ["localhost", "scripts", "scriptsLibs"], tasks[i]);
          } else if (i == "debug") {
            gulp.task(i, ["localhost", "scriptsDebug", "scriptsLibs"], tasks[i]);
          } else if (i == "default") {
            gulp.task(i, ["normal"]);
          } else if (i == ":withoutJs" || i == ":js--n") {
            gulp.task(i, ["without"]);
          } else if (i == ":onlyJS" || i == ":js") {
            gulp.task(i, ["only"]);
          } else if (i == ":onlyJsDebug" || i == ":js--d") {
            gulp.task(i, ["debug"]);
          } else {
            gulp.task(i, tasks[i]);
          }
        } else if (tasks[i] && typeof tasks[i] === "object") {
          funcs.applyTasks(tasks[i]);
        }
      }
    }
  }
};
const tasks = {
  localhost: function() {
    conf.default.browserSync.init({
      server: true,
      notify: false
    });
  },
  css: {
    stylus: function() {
      return gulp.src("dev/styl/common.styl")
                .pipe(conf.css.sourceMaps.init())
                .pipe(conf.css.stylus({"include css": true}))
                .on("error", conf.default.notify.onError())
                .pipe(conf.css.sourceMaps.write())
                .pipe(conf.css.autoprefixer(["last 15 versions", "> 1%"], {cascade: true}))
                .pipe(gulp.dest("css/"))
                .pipe(conf.default.browserSync.reload({stream: true}));
    },
    cssLibs: function() {
      return gulp.src("dev/libs/css/**/*.css")
                .pipe(conf.css.concat("libs.css"))
                .pipe(gulp.dest("css/"))
                .pipe(conf.default.browserSync.reload({stream: true}));
    }
  },
  html: {
    pages: function() {
      return gulp.src("dev/pug/*.pug")
                .pipe(conf.html.pug({pretty: true}))
                .pipe(gulp.dest(""))
                .pipe(conf.default.browserSync.reload({stream: true}));
    }
  },
  js: {
    scripts: function(callback) {
      let firstBuildReady = false;
      let done = function(err, stats) {
        firstBuildReady = true;
        if (err) {
          return false;
        }
      };
      return gulp.src("dev/babel/*.js")
                .on("error", conf.default.notify.onError())
                .pipe(conf.js.named())
                .pipe(conf.js.webpackStream(webpackOptions, null, done))
                .pipe(gulp.dest("js/"))
                .pipe(conf.default.browserSync.reload({stream: true}))
                .on("data", function() {
                  if (firstBuildReady) {
                    callback();
                  }
                });
    },
    scriptsDebug: function(callback) {
      let firstBuildReady = false;
      let done = function(err, stats) {
        firstBuildReady = true;
        if (err) {
          return false;
        }
      };
      return gulp.src("dev/babel/*.js")
                .on("error", conf.default.notify.onError())
                .pipe(conf.js.named())
                .pipe(conf.js.webpackStream(webpackOptions))
                .pipe(gulp.dest("js/"))
                .pipe(conf.default.browserSync.reload({stream: true}))
                .on("data", function() {
                  if (firstBuildReady) {
                    callback();
                  }
                });
    },
    scriptsLibs: function() {
      return gulp.src("dev/libs/js/*.js")
                .pipe(gulp.dest("js/libs"))
                .pipe(conf.default.browserSync.reload({stream: true}));
    }
  },
  sprites: {
    svg: function() {
      let options = {
        log: "debug",
        mode: {
          symbol: {
            sprite: "svg-sprite.svg",
            dest: ""
          }
        }
      };
      return gulp.src("sprites/svg/*.svg")
                .pipe(conf.svg.plumber())
                .pipe(conf.svg.cheerio({
                  run: function($) {
                    $("[fill]").removeAttr("fill");
                    $("[stroke]").removeAttr("stroke");
                    $("[style]").removeAttr("style");
                  },
                  parserOptions: {
                    xmlMode: true
                  }
                }))
                .pipe(conf.svg.replace("&gt;", ">"))
                .pipe(conf.svg.sprite(options))
                .on("error", function(error) {
                  console.log(error);
                })
                .pipe(gulp.dest("sprites/"))
                .pipe(conf.default.browserSync.reload({stream: true}));
    },
    img: function() {
      let sprite = gulp.src("sprites/png/*.png")
                      .pipe(conf.img.sprite({
                        imgName: "png-sprite.png",
                        cssName: "sprite.styl",
                        cssFormat: "stylus",
                        algorithm: "binary-tree",
                        cssTemplate: "sprites/conf/stylus.template.mustache"
                      }));
      let imgStream = sprite.img.pipe(gulp.dest("sprites/"));
      let cssStream = sprite.css.pipe(gulp.dest("dev/styl/general/"));
      
      return conf.default.merge(imgStream, cssStream);
    }
  },
  watch: {
    normal: function() {
      gulp.watch("dev/pug/**/*.pug", ["pages"]);
      gulp.watch("dev/styl/**/*.styl", ["stylus"]);
      gulp.watch("dev/libs/css/**/*.css", ["cssLibs"]);
      gulp.watch("dev/libs/js/*.js", ["scriptsLibs"]);
      gulp.watch("sprites/svg/*.svg", ["svg"]);
      gulp.watch("sprites/png/*.png"), ["img"];
    },
    js: {
      without: function() {
        gulp.watch("dev/pug/**/*.pug", ["pages"]);
        gulp.watch("dev/styl/**/*.styl", ["stylus"]);
        gulp.watch("dev/libs/css/**/*.css", ["cssLibs"]);
        gulp.watch("sprites/svg/*.svg", ["svg"]);
        gulp.watch("sprites/png/*.png"), ["img"];
      },
      only: function() {
        gulp.watch("dev/libs/js/*.js", ["scriptsLibs"]);
      },
      debug: function() {
        gulp.watch("dev/libs/js/*.js", ["scriptsLibs"]);
      }
    }
  },
  ":withoutJs": function() {},
  ":onlyJs": function() {},
  ":onlyJsDebug": function() {},
  default: function() {}
};

tasks[":js--n"] = tasks[":withoutJs"];
tasks[":js"] = tasks[":onlyJs"];
tasks[":js--d"] = tasks[":onlyJsDebug"];

funcs.applyTasks(tasks);