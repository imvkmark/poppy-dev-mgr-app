<template>
    <PxMain title="滚动">
        <ElRow :gutter="20">
            <ElCol :span="12">
                <h3>基于页面的滚动</h3>
                <p>
                    当前每个元素高度 200 <br>
                    Offset-Y:{{ trans.top }} Height : {{ trans.height }} <br>
                    这里的平滑滚动用到了
                    <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-behavior" target="_blank">
                        <code>Css 属性 (scroll-behavior)</code>
                    </a>
                </p>
                <p>
                    <ElButton plain size="small" hairline @click="refList.scrollTop=0" style="margin-right: 0.5rem;">滚动到顶部</ElButton>
                    <ElButton plain size="small" hairline @click="onScrollTo">滚动到 5 (偏移量是 4个单位)</ElButton>
                </p>
            </ElCol>
            <ElCol :span="12">
                <div class="main-fixed" ref="refList" @scroll="onScroll">
                    <div v-for="i in 10" :key="i" :class="`scroll bg-${i}`">{{ `scroll-${i}` }}</div>
                </div>
            </ElCol>
        </ElRow>
    </PxMain>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import PxMain from '@/framework/components/base/PxMain.vue';

const refList: any = ref(null);
const trans = reactive({
    refList: null,
    top: 0,
    height: 0
})
const onScroll = function (e) {
    trans.top = e.target.scrollTop;
    trans.height = e.target.scrollHeight;
}
const onScrollTo = function () {
    refList.value.scrollTop = 200 * 4;
}

const initValue = function () {
    trans.height = refList.value.scrollHeight;
}
onMounted(initValue);
</script>

<style scoped lang="less">
.main-fixed {
    overflow-y: auto;
}

.scroll {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 百分比颜色
 * ---------------------------------------- */
.loopPercentWidth(@counter) when (@counter >= 0) {
    .loopPercentWidth((@counter - 1));
    .bg-@{counter} {
        background: darken(#F3D9FA, 2% * @counter);
    }
}

.loopPercentWidth(10);
</style>
