var tmplFolder = 'tmpl'; //template folder
var srcFolder = 'src'; //source folder
var buildFolder = 'build'; //build folder


var gulp = require('gulp');
var watch = require('gulp-watch');
var fs = require('fs');
var ts = require('typescript');
var combineTool = require('../magix-composer/index');
var del = require('del');


combineTool.config({
    tmplFolder: tmplFolder,
    srcFolder: srcFolder,
    projectName: 'yy-',
    debug:true,
    tmplAddViewsToDependencies: false,
    compileJSStart(content, e) {
        var str = ts.transpileModule(content, {
            compilerOptions: {
                lib: ['es7'],
                target: 'es6',
                module: ts.ModuleKind.CommonJS
            }
        });
        str = str.outputText;
        return str;
    }
});

gulp.task('cleanSrc', function () {
    return del(srcFolder);
});
gulp.task('combine', ['cleanSrc'], function () {
    return combineTool.combine();
});
gulp.task('watch', ['combine'], function () {
    watch(tmplFolder + '/**/*', function (e) {
        if (fs.existsSync(e.path)) {
            combineTool.processFile(e.path);
        } else {
            combineTool.removeFile(e.path);
        }
    });
});

var uglify = require('../gulp-terser-scoped/index');
gulp.task('cleanBuild', function () {
    return del(buildFolder);
});
gulp.task('build', ['cleanBuild'], function () {
    combineTool.config({
        debug: false
    });


    return combineTool.combine().then(() => {
        return gulp.src(srcFolder + '/**/*.js')
            .pipe(uglify({
                compress: {
                    drop_console: true,
                    global_defs: {
                        DEBUG: false
                    }
                },
                output: {
                    ascii_only: true
                }
            }))
            .pipe(gulp.dest(buildFolder));
    });
});
gulp.task('embed', () => {
    let c = fs.readFileSync('./build/boot.js') + '';
    let index = fs.readFileSync('./index.html') + '';
    c = c.replace(/\$/g, '$&$&');
    index = index.replace(/<script[^>]*?>[\s\S]*?<\/script>/, '<script>' + c + '</script>');
    fs.writeFileSync('./index.html', index);
});