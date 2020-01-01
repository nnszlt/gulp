/*
 * @Author: nns4
 * @Date: 2020-01-01 10:54:23
 * @LastEditors  : nns4
 * @FilePath: /gulp4/demo_site/gulpTask.js
 * @Description: 
 */
const fs = require('fs'),
    chalk = require('chalk'),
    minimist = require('minimist'),
    path = require('path'),
    src = "./src/pages/",
    options = minimist(process.argv.slice(2), {
        string: 'name',
        default: {
            name: process.env.NODE_ENV || 'newPage' + Date.now()
        }
    });
const config = require("./config/config.json")
creatPage = (callback) => {
    if (fs.existsSync(path.join(__dirname, src + options.name))) {
        console.log(chalk.red(`错误------创建的的文件${ options.name}存在`))
    } else {
        fs.mkdir(path.join(__dirname, `${src + options.name}/less`), {
            recursive: true
        }, (err) => {
            fs.writeFile(path.join(__dirname, `${src + options.name}/less/${options.name}.less`), "", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
        fs.mkdir(path.join(__dirname, `${src + options.name}/js`), {
            recursive: true
        }, (err) => {
            fs.writeFile(path.join(__dirname, `${src + options.name}/js/${options.name}.js`), "", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
        fs.mkdir(path.join(__dirname, `${src + options.name}/images`), {
            recursive: true
        }, (err) => {
            let buffer = fs.readFileSync(path.join(__dirname, `/config/tempHtml.shtml`))
            fs.writeFile(path.join(__dirname, `${src + options.name}/${options.name}.shtml`), buffer, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(chalk.green(`成功------${ options.name}创建成功`))
            });
        });

    }


    callback();
}

module.exports = {
    creatPage
}