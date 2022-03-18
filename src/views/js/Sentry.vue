<template>
    <PxMain title="异常处理">
        <div class="main-content">
            <ElRow :gutter="20">
                <ElCol :span="12">
                    <ElButton @click="onException">触发异常</ElButton>
                    <p></p>
                    <ElAlert>点击会触发一个自定义异常</ElAlert>
                </ElCol>
                <ElCol :span="12">

                </ElCol>
            </ElRow>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '@/framework/components/base/PxMain.vue';

const onException = function () {
    doNotExistsMethod()
    throw 'Test Sentry Error';
};

</script>

<style scoped lang="less">
</style>
