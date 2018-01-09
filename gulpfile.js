"use strict"

const conf = {
  default: {
    gulp: require("gulp"),
    browserSync: require("browser-sync"),
    notify: require("gulp-notify")
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
  }
};
const NODE_ENV = process.env.NODE_ENV || "dev";
const webpack = conf.js.webpackStream.webpack;
const gulp = conf.default.gulp;
const webpackOptions = {
  output: {
    publicPath: "/js/",
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
    new webpack.NoEmitOnErrorsPlugin(),
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
            gulp.task(i, ["localhost", "pages", "stylus", "cssLibs", "scripts", "scriptsLibs", "svg"], tasks[i]);
          } else if (i == "without") {
            gulp.task(i, ["localhost", "pages", "stylus", "cssLibs", "svg"], tasks[i]);
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
      let func = gulp.src("dev/styl/common.styl");
      func.pipe(conf.css.sourceMaps.init());
      func.pipe(conf.css.stylus({
        "include css": true
      }));
      func.on("error", conf.default.notify.onError());
      func.pipe(conf.css.sourceMaps.write());
      func.pipe(conf.css.autoprefixer(["last 15 versions", "> 1%"], {cascade: true}));
      func.pipe(gulp.dest("css"));
      funcs.reloadStream(func);
      return func;
    },
    cssLibs: function() {
      let func = gulp.src("dev/libs/css/**/*.css");
      func.pipe(conf.css.concat("libs.css"));
      func.pipe(gulp.dest("css"));
      funcs.reloadStream(func);
      return func;
    }
  },
  html: {
    pages: function() {
      let func = gulp.src("dev/pug/*.pug");
      func.pipe(conf.html.pug({pretty: true}));
      func.pipe(gulp.dest(""));
      funcs.reloadStream(func);
      return func;
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
      let func = gulp.src("dev/babel/*.js");
      func.on("error", conf.default.notify.onError());
      func.pipe(conf.js.named());
      func.pipe(conf.js.webpackStream(webpackOptions, null, done));
      func.pipe(gulp.dest("js/"));
      funcs.reloadStream(func);
      func.on("data", function() {
        if (firstBuildReady) {
          callback();
        }
      });
      return func;
    },
    scriptsDebug: function(callback) {
      let firstBuildReady = false;
      let done = function(err, stats) {
        firstBuildReady = true;
        if (err) {
          return false;
        }
      };
      let func = gulp.src("dev/babel/*.js");
      func.on("error", conf.default.notify.onError());
      func.pipe(conf.js.named());
      func.pipe(conf.js.webpackStream(webpackOptions));
      func.pipe(gulp.dest("js/"));
      funcs.reloadStream(func);
      func.on("data", function() {
        if (firstBuildReady) {
          callback();
        }
      });
      return func;
    },
    scriptsLibs: function() {
      let func = gulp.src("dev/libs/js/*.js")
      func.pipe(gulp.dest("js/libs"));
      funcs.reloadStream(func);
      return func;
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
      let func = gulp.src("sprites/svg/*.svg");
      func.pipe(conf.svg.plumber());
      func.pipe(conf.svg.cheerio({
        run: function($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: {
          xmlMode: true
        }
      }));
      func.pipe(conf.svg.replace("&gt;", ">"));
      func.pipe(conf.svg.sprite(options));
      func.on("error", function(error) {
        console.log(error);
      });
      func.pipe(gulp.dest("sprites"));
      funcs.reloadStream(func);
      return func;
    }
  },
  watch: {
    normal: function() {
      gulp.watch("dev/pug/**/*.pug", ["pages"]);
      gulp.watch("dev/styl/**/*.styl", ["stylus"]);
      gulp.watch("dev/libs/css/**/*.css", ["cssLibs"]);
      gulp.watch("dev/libs/js/*.js", ["scriptsLibs"]);
      gulp.watch("sprites/svg/*.svg", ["svg"]);
    },
    js: {
      without: function() {
        gulp.watch("dev/pug/**/*.pug", ["pages"]);
        gulp.watch("dev/styl/**/*.styl", ["stylus"]);
        gulp.watch("dev/libs/css/**/*.css", ["cssLibs"]);
        gulp.watch("sprites/svg/*.svg", ["svg"]);
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