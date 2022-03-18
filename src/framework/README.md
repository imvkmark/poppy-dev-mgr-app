# Poppy MgrApp 框架模块

本项目作为 Poppy 框架子树来进行使用


## 配置

### 需要的组件

### 安装

**拉取代码**



```
$ git remote add framework git@github.com:imvkmark/popjs-_framework.git
$ git subtree pull --prefix=src/framework framework develop
```

**配置**

_vite.config.ts_

```
import pkgJson from './package.json';
...

resolve: {
    alias: {
        ...
        '@': resolve(__dirname, 'src/') // 设置 `@` 指向 `src` 目录
        ...
    }
}
...
define: {
    ...
    'import.meta.env.PY_APP_VERSION': JSON.stringify(pkgJson.version)
    ...
},
```

_src/utils/http.ts_

需要 export 出一个 Axios 实例

## 当前支持

- Laravel 6.x 的验证规则
- 自动创建Form 表单
- 支持项目侧边打开或者弹窗打开
- 自动列表(暂不支持搜索)

## 后续工作

- [] 列表支持搜索
- [] 列表支持自定义数据渲染和模型两种方式
- [] 权限管理

## 当前问题

- [] 如何将 axios 不进行强绑定, 现在是约定文件位置
- [] 主题组件的大小设定(预留未完成)
