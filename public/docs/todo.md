## 需要对接的数据

- [] console.log 打包的时候依然存在
- [] 对接表单的显示以及验证
    - Text
    - Image
    - Checkbox
    - RadioBox
    - MultiImage
    - Select
    - SelectWithRemote
- [] 验证规则 : 参考 Laravel 文档


- array
- date
- date_format:format
- dimensions
- image
- file
- timezone
- 需要支持自定义的参数代入和替换
- [-]date_equals:date(不实用)
- [x]different:field
- [x]filled
- [x]required_if:anotherfield,value1,value2,value3
- [x]required_unless:anotherfield,value1,value2,value3
- [x]present
- [x]required_with
- [x]required_without
- [x]required_with_all
- [x]required_without_all
- [x]gt:field
- [x]gte:field
- [x]lt:field
- [x]lte:field
- [x]before:date
- [x]before_or_equal:date
- [x]after:date
- [x]after_or_equal:date
- [x]boolean
- [x]confirmed
- [x]ends_with:foo,bar
- [x]in:foo,bar
- [x]not_in:foo,bar
- [x]not_regex:pattern
- [x]nullable
- [x]regex:pattern
- [x]same:field
- [x]starts_with:foo,bar
## Change Log

- ~~上传失败更改为 Reject~~