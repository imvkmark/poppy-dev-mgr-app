<template>
    <div class="content">
        <ElRow justify="center">
            <ElCol :lg="{span:12}" :md="{span:16}" :sm="{span:18}" :xs="{span:22}" :span="12">
                <div class="logo">
                    <img src="@/framework/assets/image/logo.png" alt="WuliCode"> Wulicode
                </div>
                <div class="input">
                    <ElInput v-model="trans.input"/>
                </div>
            </ElCol>
        </ElRow>
    </div>
    <div class="footer">
        Copyright 2021 - present zhaody901(At)126.com &nbsp;
        <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" rel="nofollow">鲁ICP备13016276号-7</a>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const trans = reactive({
    top: 0,
    height: 0,
    input: ''
})
</script>

<style scoped lang="less">
.content {
    display: flex;
    align-items: center;
    min-height: calc(100vh - 8rem);
    .el-row {
        flex: 1;
    }
    .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #081736;
        font-size: 25px;
        padding-bottom: 1.25rem;
        img {
            width: 35px;
            margin-right: 10px;
        }
    }
    .input {
        min-width: 40vw;
    }
}

.footer {
    position: fixed;
    height: 4rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
</style>
