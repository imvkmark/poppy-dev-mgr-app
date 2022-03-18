# Poppy Manage Application

后台管理系统, 本项目致力于打造通用版本的前后端分离管理系统, 本项目打包之后会并入 `poppy/mgr-app` 项目

**popjs 框架**
此系统的组件来自于 popjs-_framework 组件

```
$ git remote add framework git@github.com:imvkmark/popjs-_framework.git
$ git subtree add --prefix=src/framework framework develop
$ git subtree pull --prefix=src/framework framework develop

# git submodule add git@github.com:imvkmark/popjs-_framework.git src/framework
```

**快速开始**

```bash
# 安装
$ yarn

# 启动
$ yarn start:<env>

# 打包
$ yarn build:<env>
```

**文档**

本项目文档参考 https://wulicode.com/doc , 如有需要请提交 [issue](https://github.com/imvkmark/wulicode-webapp/issues)


MIT Copyright © 2022 duoli(zhaody901@126.com)
