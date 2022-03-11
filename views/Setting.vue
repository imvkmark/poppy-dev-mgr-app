<template>
    <PxMain v-loading="store.getters['poppy/isLoading'](trans.path)">
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                {{ trans.title }}
            </h3>
        </template>
        <ElTabs v-model="trans.groupCurrent" type="card" @tab-click="onGroupClick">
            <ElTabPane :label="get(item, 'title')" :key="get(item, 'type')" v-for="item in trans.groups"/>
        </ElTabs>
        <ElTabs v-model="trans.current">
            <ElTabPane v-for="(form, key) in trans.forms" :key="key" :label="get(form, 'title')" :name="key">
                <FormWidget :attr="get(form, 'attr', {})" :items="get(form, 'items', [])"
                    :model="get(trans.models, key, {})" :buttons="get(form, 'buttons', [])" @submit="onSubmit"/>
            </ElTabPane>
        </ElTabs>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { find, findKey, first, get, keys, set } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode, base64Encode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";
import useUtil from "@/framework/composables/useUtil";

const router = useRouter();
const store = useStore();
const { pyAction } = useUtil();
const trans = reactive({
    url: '',
    title: '',
    current: '',
    groupCurrent: '0',
    group: '',
    forms: [],
    groups: [],
    models: [],
})

const queryRef = ref('struct,data')

const doRequest = () => {
    if (!router.currentRoute.value.params.type) {
        return;
    }
    trans.url = base64Decode(String(router.currentRoute.value.params.type));
    let path = trans.url;

    // group 进行拦截
    let group = String(get(router.currentRoute.value.query, 'group', ''));
    if (group) {
        path = base64Decode(group);
    }
    apiPyRequest(path, {
        _query: queryRef.value
    }).then(({ data }) => {
        trans.title = get(data, 'title');
        trans.models = get(data, 'models');
        trans.forms = get(data, 'forms');
        trans.current = String(first(keys(trans.forms)))
        trans.groups = get(data, 'groups');
        trans.groupCurrent = Number(findKey(trans.groups, (item: any) => {
            return path === get(item, 'path', '')
        })).toString();
    })
}

const onGroupClick = (form: any) => {
    let group = find(trans.groups, (item, key) => key == form.index);
    router.push({
        name: 'py:setting.index',
        params: {
            type: base64Encode(trans.url)
        },
        query: {
            group: base64Encode(get(group, 'path', ''))
        }
    })
}

const onSubmit = (data: any) => {
    trans.url = base64Decode(String(router.currentRoute.value.params.type));
    let path = trans.url;

    // group 进行拦截
    let group = String(get(router.currentRoute.value.query, 'group', ''));
    if (group) {
        path = base64Decode(group);
    }
    set(data, '_query', 'submit');
    apiPyRequest(path, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });

        pyAction(data);
    })
}

const init = () => {
    let url = base64Decode(String(router.currentRoute.value.params.type));
    if (!url) {
        return;
    }
    if (trans.url === url) {
        return;
    }
    trans.url = url;
    doRequest();
}

watch(() => router.currentRoute.value.params.type, () => {
    if (router.currentRoute.value.name !== 'py:setting.index') {
        return;
    }
    init();
})
onMounted(() => {
    init();
})
</script>

<style scoped lang="less">
</style>
