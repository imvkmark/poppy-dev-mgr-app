<template>
    <PxMain :title="trans.title" v-loading="trans.loading">
        <ElTabs v-model="trans.groupCurrent" type="card" @tab-click="onGroupClick">
            <ElTabPane :label="get(item, 'title')" :key="get(item, 'type')" v-for="item in setting.groups"/>
        </ElTabs>
        <ElTabs :model-value="trans.current">
            <ElTabPane v-for="form in setting.forms" :key="form" :label="get(form, 'title')">
                <FormWidget :attr="get(form, 'attr', {})" :items="get(form, 'items', [])"
                    :model="get(form, 'model', {})" :buttons="get(form, 'buttons', [])" @submit="onSubmit"/>
            </ElTabPane>
        </ElTabs>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { find, findKey, get } from 'lodash-es';
import PxMain from '@/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode, base64Encode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";

const router = useRouter();
const store = useStore();

const trans = reactive({
    type: '',
    path: '',
    title: '',
    current: 0,
    loading: false,
    groupCurrent: '0',
})
const setting = reactive({
    title: '',
    type: '',
    description: '',
    path: '',
    group: '',
    forms: [],
    groups: [],
})

const doRequest = () => {
    trans.loading = true;
    setting.path = base64Decode(String(router.currentRoute.value.params.type));
    let path = setting.path;

    // group 进行拦截
    let group = String(get(router.currentRoute.value.query, 'group', ''));
    if (group) {
        path = base64Decode(group);
    }
    apiPyRequest(path, {}, 'get').then(({ data, success, resp }) => {
        if (!success) {
            store.commit('poppy/SET_MESSAGE', resp);
            return;
        }
        trans.current = 0;
        trans.title = get(data, 'title');
        setting.forms = get(data, 'forms');
        setting.groups = get(data, 'groups');
        trans.loading = false;
        trans.groupCurrent = Number(findKey(setting.groups, (item: any) => {
            return path === get(item, 'path', '')
        })).toString();
    })
}

const onGroupClick = (form: any) => {
    let group = find(setting.groups, (item, key) => key == form.index);
    router.push({
        name: 'setting.index',
        params: {
            type: base64Encode(setting.path)
        },
        query: {
            group: base64Encode(get(group, 'path', ''))
        }
    })
}

const onSubmit = (data: any) => {
    apiPyRequest(setting.path, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });
        const action = get(data, 'action', '');
        const time = get(data, 'time', 0);

        // 触发全局动作
        if (action) {
            setTimeout(() => {
                store.commit('poppy/SET_ACTION', action);
            }, time)
        }
    })
}

watch(() => router.currentRoute.value.params.type, () => {
    doRequest();
}, { deep: true })
onMounted(() => {
    doRequest();
})
</script>

<style scoped lang="less">
@import '../../assets/style/vars';
</style>
