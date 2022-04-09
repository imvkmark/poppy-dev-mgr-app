# Poppy Manage Application

后台管理系统, 本项目致力于打造通用版本的前后端分离管理系统, 本项目打包之后会并入 `poppy/mgr-app` 项目

## 开始

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

本项目文档参考 https://wulicode.com/doc , 如有需要请提交 [issue](https://github.com/imvkmark/wulicode-mgr-app/issues)

MIT Copyright © 2022 duoli(zhaody901@126.com)

## 验证规则

支持以下的验证规则, 规则的说明见 : [Laravel 6.0 可用验证规则](https://learnku.com/docs/laravel/6.x/validation/5144#available-validation-rules)

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
