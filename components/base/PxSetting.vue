<template>
    <ElIcon @click="onSwitchDrawer" class="theme">
        <Stamp/>
    </ElIcon>
    <ElDrawer v-model="trans.visible" title="用户设定" :size="sizePercent(trans.media)">
        <ElForm :size="trans.size">
            <ElDivider content-position="left">主题</ElDivider>
            <ElFormItem label="主题">
                <ElRadioGroup :model-value="trans.style" @update:model-value="onUpdateStyle">
                    <ElRadioButton label="light">浅色</ElRadioButton>
                    <ElRadioButton label="dark">深色</ElRadioButton>
                </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label="元素大小">
                <ElRadioGroup :model-value="trans.size" @update:model-value="onUpdateSize">
                    <ElRadioButton label="small">小号</ElRadioButton>
                    <ElRadioButton label="default">默认</ElRadioButton>
                    <ElRadioButton label="large">大号</ElRadioButton>
                </ElRadioGroup>
            </ElFormItem>
            <ElFormItem label="清理缓存">
                <ElButton :loading="trans.clearing" @click="onClearCache">清理</ElButton>
            </ElFormItem>
            <ElDivider content-position="left">用户信息</ElDivider>
            <ElFormItem label="退出登录">
                <ElButton @click="onLogout" type="danger" plain>退出</ElButton>
            </ElFormItem>
        </ElForm>
    </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { Stamp } from "@element-plus/icons-vue";
import { sizePercent, toast } from "@/framework/utils/helper";
import useUserUtil from "@/composables/useUserUtil";
import { ElMessageBox } from "element-plus";


// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    size: computed(() => store.state.poppy.size),
    style: computed(() => store.state.poppy.style),
    media: computed(() => store.state.poppy.media),
    loading: computed(() => store.state.poppy.loading),
    visible: false,
    clearing: false,
});

const { userLogout } = useUserUtil();

const onUpdateSize = (value: string) => {
    store.dispatch('poppy/SetSize', value)
}
const onUpdateStyle = (value: string) => {
    store.dispatch('poppy/SetStyle', value)
}
const onSwitchDrawer = () => {
    trans.visible = !trans.visible;
}

const onClearCache = () => {
    trans.clearing = true;
    store.dispatch('poppy/ClearCache').then(() => {
        trans.clearing = false;
    })
}

const onLogout = () => {
    ElMessageBox.confirm(
        '确认退出登录?',
        '确认', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        userLogout(() => {
            store.dispatch('nav/Destruct')
            trans.visible = false;
            toast('已退出登录');
        });
    })
}


</script>

<style lang="less" scoped>
.theme {
    cursor: pointer;
    height: 3.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
    font-size: 1.2rem;
    &:hover {
        color: var(--wc-link-active-color);
    }
}
</style>
