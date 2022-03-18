<template>
    <PxMain title="动画">
        <ElRow :gutter="20">
            <ElCol :span="12">
                <h3>持续转动</h3>
                <div class="rotate">
                    <img src="@/framework/assets/image/logo.png" alt="LOGO">
                </div>
            </ElCol>
            <ElCol :span="12">

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

const initValue = function () {
    trans.height = refList.value.scrollHeight;
}
onMounted(initValue);
</script>

<style scoped lang="less">
.rotate img {
    animation: rotate 5s linear infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.rotate {
    background: #3E3E3E;
    min-height: 300px;
    min-width: 300px;
    img {
        width: 30%;
    }
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
