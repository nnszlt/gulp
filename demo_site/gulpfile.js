const {
    src,
    dest,
    watch,
    series,
    parallel
} = require('gulp'),
    minimist = require('minimist'), {
        creatPage
    } = require("./gulpTask"),
    chalk = require('chalk'),
    config = require("./config/config.json"),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    plumber = require("gulp-plumber"),
    moment = require('moment'),
    uglify = require("gulp-uglify"),
    cssm = require("gulp-clean-css"),
    prefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    less = require("gulp-less");

// --env dev 测试环境
// --env pro 生产环境
const options = minimist(process.argv.slice(2), {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'dev'
    }
});
const outDir = !process.title.includes('debug') ? 'dist/' : 'preview/'
/**
 * @description preview清空 
 */
function cleanPreview() {
    return src(["./preview/"], {
        allowEmpty: true
    }).pipe(clean());
}
/**
 * @description preview清空 
 */
function cleanDist() {
    return src(["./dist/"], {
        allowEmpty: true
    }).pipe(clean());
}


/**
 * @description 模板文件内容编译 
 */
function staticFileComp() {
    return src(['src/pages/*.{html,shtml,htm}', 'src/pages/**/*.{html,shtml,htm}'])
        .pipe(template(config[options.env]))
        .pipe(replace("less", "css"))
        .pipe(replace("../assets", ""))
        .pipe(rename({
            dirname: ''
        }))
        .pipe(dest(outDir))
}

/**
 * @description 移动public/*.shtml 
 */
function publicShtml() {
    return src(['src/public/*.{html,shtml,htm}', 'src/public/**/*.{html,shtml,htm}'])
        .pipe(template(config[options.env]))
        .pipe(replace(".less", ".css"))
        .pipe(replace("/less/", "/css/"))
        .pipe(replace("../assets", ""))
        .pipe(dest(`${outDir}/public`))
}


/**
 * @description: less编辑
 */
function convertLess() {
    return src(['src/pages/*.less', 'src/pages/**/*.less', 'src/assets/less/*.less', 'src/assets/less/**/*.less'])
        .pipe(prefixer({
            overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
        }))
        .pipe(less())
        .pipe(rename({
            dirname: ''
        }))
        .pipe(dest(`${outDir}/css`))
}


/**
 * @description babel转换
 */
function selfBabel() {
    return src(['src/*.js', 'src/**/*.js', 'src/assets/js/*.js', 'src/assets/js/**/*.js']).pipe(plumber({
            errorHandler: function (e) {
                console.log("----------------es6语法有误，导致babel转换失败start-----------");
                console.log(marked(e.message));
                console.log("----------------es6语法有误，导致babel转换失败end-----------");
            }
        }))
        .pipe(rename({
            dirname: ''
        }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest(`${outDir}/js`))
}

/**
 * @description 拷贝资源
 */
function copyFile() {
    return src(['src/*.{jpg,png,gif,svg,mp4}', 'src/**/*.{jpg,png,gif,svg,mp4}', 'src/assets/images/*.{jpg,png,gif,svg,mp4}', 'src/assets/images/**/*.{jpg,png,gif,svg,mp4}', 'src/assets/icons/*', ])
        .pipe(rename({
            dirname: ''
        }))
        .pipe(dest(`${outDir}/images`))
}

/**
 * @description 图片压缩
 * @returns 
 */
function imgmin() {
    return src(['dist/images/*.{jpeg,jpg,png,gif}'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant({
                quality: '100'
            })]
        }))
        .pipe(dest(outDir + "/images"))
}

/**
 * @description js压缩
 * @returns 
 */
function jsmin() {
    return src('dist/js/*.js')
        .pipe(uglify())
        .pipe(dest(outDir + "/js"));
}


/**
 * @description css压缩
 * @returns 
 */
function cssmin() {
    return src('dist/css/*.css')
        .pipe(cssm({
            compatibility: 'ie8',
            keepSpecialComments: '*'
        }))
        .pipe(dest(outDir + "/css"));
}
/**
 * @description ie8兼容css生成
 * @returns 
 */
function ie8Convert() {
    return src(['dist/css/*.css'])
        .pipe(replace(/([1-9]\d*.\d*|0?.\d*[1-9]\d*|\d*[1-9]\d*)rem/g, function (rem, p, offset, string) {
            if (!!rem) {
                return (parseFloat(rem) * parseInt(100)) + "px";
            }
        }))
        .pipe(rename({
            suffix: '_ie8'
        }))
        .pipe(dest(outDir + "/css"))
}
/**
 * @description 本地web服务器 
 */
function webService() {
    browserSync.init({
        port: config.serverPort,
        server: {
            baseDir: './preview/',
            directory: true,
            middleware: function (req, res, next) {
                var fs = require('fs');
                var ssi = require('ssi');
                var baseDir = './preview/';
                var pathname = require('url').parse(req.url).pathname;
                var filename = require('path').join(baseDir, pathname.substr(-1) === '/' ? pathname + 'index.shtml' : pathname);
                var parser = new ssi(baseDir, baseDir, '/**/*.shtml', true);
                if (filename.indexOf('.shtml') > -1 && fs.existsSync(filename))
                    res.end(parser.parse(filename, fs.readFileSync(filename, {
                        encoding: 'utf8'
                    })).contents);
                else
                    next();
            }
        }
    });
}

/**
 * @description 文件调整监听 
 */
function watchFile() {
    let watcher = watch(['src/*.*', 'src/**/*.*']);
    watcher.on('change', path => {
        let separator = path.indexOf("\\") > 0 ? "\\" : "/"; //分隔符
        let pathArray = path.split(separator);
        let fileName = pathArray[pathArray.length - 1];
        let type = fileName.split(".")[1];
        let nowDate = moment().locale('zh-cn').format('HH:mm:ss');
        if (type == 'html' || type == 'shtml') {
            src(path)
                .pipe(replace(".less", ".css"))
                .pipe(replace("/less/", "/css/"))
                .pipe(replace("../assets", ""))
                .pipe(rename({
                    dirname: ''
                }))
                .pipe(dest('preview/' + pathArray[1]));
            browserSync.reload()
            console.log(chalk.yellow(`[${nowDate}]更新文件 ${path}到preview目录`));
        } else if (type == "js") {
            src(['src/*.js', 'src/**/*.js', 'src/assets/js/*.js', 'src/assets/js/**/*.js']).pipe(plumber({
                    errorHandler: function (e) {
                        console.log("----------------es6语法有误，导致babel转换失败start-----------");
                        console.log(marked(e.message));
                        console.log("----------------es6语法有误，导致babel转换失败end-----------");
                    }
                }))
                .pipe(rename({
                    dirname: ''
                }))
                .pipe(babel({
                    presets: ['@babel/env']
                }))
                .pipe(dest(`${outDir}/js`))
            browserSync.reload()
            console.log(chalk.yellow(`[${nowDate}]更新文件 ${path}到preview/js`));
        } else if (type == "less") {
            src(['src/pages/*.less', 'src/pages/**/*.less', 'src/assets/less/*.less', 'src/assets/less/**/*.less'])
                .pipe(prefixer({
                    overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
                }))
                .pipe(less())
                .pipe(rename({
                    dirname: ''
                }))
                .pipe(dest(`${outDir}/css`))
            browserSync.reload()
            console.log(chalk.yellow(`[${nowDate}]更新文件 ${path}到preview/css`));
        } else {
            src(path)
                .pipe(rename({
                    dirname: ''
                }))
                .pipe(dest('preview/images/'));
            browserSync.reload()
            console.log(chalk.yellow(`[${nowDate}]更新文件 ${path}到dist/images目录`));
        }
    });
}


//开发模式
exports.debug = series(cleanPreview, parallel(series(parallel(publicShtml, staticFileComp, convertLess, selfBabel, copyFile), watchFile), webService));
//创建页面
exports.creat = creatPage;
//文件打包
exports.build = series(cleanDist, parallel(publicShtml, staticFileComp, convertLess, selfBabel, copyFile), imgmin, jsmin, ie8Convert, cssmin)