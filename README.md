# Poppy MgrApp 框架模块

本项目作为 Poppy 框架子树来进行使用

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
