# gulp debug

开发模式

# gulp creat

gulp creat --name demo
创建 demo 文件

# gulp build

1.  gulp build --env dev 打包测试
2.  gulp build --env pro 打包生产

文件目录
.
├── demo\*site \*\*\_demo 站点**\*
│   ├── config **_配置_**
│   │   ├── config.json **_站点变量配置_**
│   │   └── tempHtml.shtml **_html 模版_**
│   ├── gulpTask.js **_gulp 自定义任务_**
│   ├── gulpfile.js **_gulp 文件_**
│   └── src **_开发文件夹_**
│   ├── assets **静态文件**
│   │   ├── icons **字体图标**
│   │   ├── images **_公用资源_**
│   │   │   ├── a.mp4
│   │   │   └── erweima.jpg
│   │   ├── js **_公用 js_**
│   │   │   └── assets.js
│   │   └── less **_公用 less_**
│   │   └── app.less
│   ├── pages **_业务目录_**
│   │   └── list **业务 文件 gulp creat --name demo 创建 demo 文件**
│   │   ├── images
│   │   ├── js
│   │   │   └── list.js
│   │   ├── less
│   │   │   └── list.less
│   │   └── list.shtml \***_页面引用 css 直接 less 结尾就可以_**_
│   └── public _**公共组件\*\*\*
│   ├── footer.shtml
│   └── header.shtml
├── gulp.md
└── package.json
