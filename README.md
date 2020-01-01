# gulp debug

开发模式

# gulp creat

gulp creat --name demo
创建 demo 文件

# gulp build

1.  gulp build --env dev 打包测试
2.  gulp build --env pro 打包生产

# 文件目录
.<br>
├── demo_site  demo 站点<br>
│   ├── config **_配置_**<br>
│   │   ├── config.json **_站点变量配置_**<br>
│   │   └── tempHtml.shtml **_html 模版_**<br>
│   ├── gulpTask.js **_gulp 自定义任务_**<br>
│   ├── gulpfile.js **_gulp 文件_**<br>
│   └── src **_开发文件夹_**<br>
│   ├── assets **静态文件**<br>
│   │   ├── icons **字体图标**<br>
│   │   ├── images **_公用资源_**<br>
│   │   │   ├── a.mp4<br>
│   │   │   └── erweima.jpg<br>
│   │   ├── js **_公用 js_**<br>
│   │   │   └── assets.js<br>
│   │   └── less **_公用 less_**<br>
│   │   └── app.less<br>
│   ├── pages **_业务目录_**<br>
│   │   └── list **业务 文件 gulp creat --name demo 创建 demo 文件**<br>
│   │   ├── images<br>
│   │   ├── js<br>
│   │   │   └── list.js<br>
│   │   ├── less<br>
│   │   │   └── list.less<br>
│   │   └── list.shtml **_页面引用 css 直接 less 结尾就可以_**<br>
│   └── public 公共组件<br>
│   ├── footer.shtml<br>
│   └── header.shtml<br>
├── gulp.md<br>
└── package.json<br>
