<template>
    <PxMain title="自定义Checkbox / Radio">
        <div class="main-content">
            <div class="custom-box">
                <label>One
                    <input type="checkbox" checked="checked">
                    <span class="cb-checkbox"></span>
                </label>
                <label>Two
                    <input type="checkbox">
                    <span class="cb-checkbox"></span>
                </label>

                <label>Three
                    <input type="checkbox">
                    <span class="cb-checkbox"></span>
                </label>

                <label>Four
                    <input type="checkbox">
                    <span class="cb-checkbox"></span>
                </label>
                <hr>
                <label>Radio One
                    <input type="radio" name="radio">
                    <span class="cb-radio"></span>
                </label>
                <label>Radio Two
                    <input type="radio" name="radio">
                    <span class="cb-radio"></span>
                </label>
            </div>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '../../framework/components/base/PxMain.vue';

</script>
<style lang="less" scoped>

/* Create the cb-checkbox/indicator (hidden when not checked) */
/* Show the checkmark when checked */
/* Style the checkmark/indicator */

// 自定义 Label
.custom-box {
    label {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        // 隐藏浏览器默认的 Checkbox
        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        // 创建自定义的 checkbox
        .cb-checkbox {
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #EEE;
            // 创建标示符, 标示符默认隐藏
            &:after {
                content: "";
                position: absolute;
                display: none;
                left: 9px;
                top: 5px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
        }

        // Radio 按钮默认样式
        .cb-radio {
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #EEE;
            border-radius: 50%;
            &:after {
                content: "";
                position: absolute;
                display: none;
                top: 9px;
                left: 9px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
            }
        }

        // 鼠标滑过加一个灰背景
        &:hover {
            input ~ .cb-checkbox,
            input ~ .cb-radio {
                background-color: #CCC;
            }
        }

        // 选中, 加一个蓝背景
        input {
            &:checked ~ .cb-checkbox,
            &:checked ~ .cb-radio {
                background-color: #2196F3;
                &:after {
                    display: block;
                }
            }
        }
    }
}


</style>
