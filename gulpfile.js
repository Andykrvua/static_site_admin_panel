const gulp = require("gulp");
const webpack = require("webpack-stream");

gulp.task("copy-html", () => {
  return gulp.src("./app/src/index.html").pipe(gulp.dest("./admin"));
});
gulp.task("build-js", () => {
  return gulp
    .src("./app/src/main.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "script.js"
        },
        watch: false,
        devtool: "source-map"
      })
    )
    .pipe(gulp.dest("./admin"));
});
