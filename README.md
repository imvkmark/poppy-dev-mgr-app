# Wulicode - App

Vite2.x + Vue3.x + TypeScript Backend Manager

## 快速开始

**安装依赖**

```bash
# 安装
$ yarn

# 启动
$ yarn start:<env>

# 打包
$ yarn build:<env>
```

**Sentry 不在开发环境下报告**

```
# config/.env.local

# 本地开发环境是 Development
NODE_ENV=development
```

## 验证规则

支持以下的验证规则,
规则的说明见 : [Laravel 6.0 可用验证规则](https://learnku.com/docs/laravel/6.x/validation/5144#available-validation-rules)

```
array
required
filled
present
ip
ipv4
boolean
starts_with
ends_with
regex
not_regex
date
ipv6
numeric
integer
alpha
url
alpha_dash
date_format
json
alpha_num
email
digits
digits_between
chid
string
mobile
accepted

// typed
max
min
between
size
in
not_in

// dependent
gt
lt
gte
lte
confirmed
different
same
after
after_or_equal
before
before_or_equal
required_if
required_unless
required_with
required_with_all
required_without
required_without_all
```

## 待处理

### 主题

- 支持切换组件大小

### 表格

- 支持自定义数据的返回
- 拆分 System Grid 框架
- 列表图片支持预览以及鼠标切换左右

## Thanks To

- 编程语言：[TypeScript 4.x](https://www.typescriptlang.org/zh/) + [JavaScript](https://www.javascript.com/)
- 构建工具：[Vite 2.x](https://cn.vitejs.dev/)
- 前端框架：[Vue 3.x](https://v3.cn.vuejs.org/)
- 路由工具：[Vue Router 4.x](https://next.router.vuejs.org/zh/index.html)
- 状态管理：[Vuex 4.x](https://next.vuex.vuejs.org/)
- UI 框架：[Vant 3.x](https://vant-contrib.gitee.io/vant/v3/#/zh-CN/home)
- CSS 预编译：[Less](http://lesscss.cn/)
- HTTP 工具：[Axios](https://axios-http.com/)
- Validator 工具：[Validator](https://vuelidate-next.netlify.app/)

MIT Copyright © 2021 duoli zhaody901@126.com


## 子树

**推送子树**
```
$ git remote add framework git@github.com:imvkmark/popjs-_framework.git
$ git subtree push --prefix=src/framework framework develop
```
