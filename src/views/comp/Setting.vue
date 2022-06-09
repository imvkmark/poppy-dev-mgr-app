<template>
    <PxMain :title="trans.title">
        <ElTabs v-model="trans.groupCurrent" type="card" @tab-click="onGroupClick">
            <ElTabPane :label="get(item, 'title')" :key="get(item, 'type')" v-for="item in trans.groups"/>
        </ElTabs>
        <ElTabs v-model="trans.current">
            <ElTabPane v-for="(form, key) in trans.forms" :key="key" :label="get(form, 'title')" :name="key">
                <FormWidget :attr="get(form, 'attr', {})" :items="get(form, 'items', [])" v-loading="store.getters['poppy/isLoading'](trans.url)"
                    :model="get(trans.models, key, {})" :buttons="get(form, 'buttons', [])" @submit="onSubmit"/>
            </ElTabPane>
        </ElTabs>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import FormWidget from '@/components/widget/FormWidget.vue';
import { find, findKey, first, get, keys, set } from 'lodash-es';
import PxMain from '@/components/backend/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode, base64Encode } from "@popjs/core/utils/helper";
import { apiPyRequest } from "@/services/poppy";
import { appSessionStore, pyGlobalMotion } from "@/utils/util";
import { enableSkeleton, sessionSettingKey } from "@/utils/conf";

const router = useRouter();
const store = useStore();
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

const getUrl = () => {
    const { type } = router.currentRoute.value.params;
    if (!type) {
        return '';
    }

    let path = base64Decode(String(type));

    // group 进行拦截
    let group = String(get(router.currentRoute.value.query, 'group', ''));
    if (group) {
        path = base64Decode(group);
    }
    return path;
}

const doRequest = () => {
    trans.url = getUrl();

    if (queryRef.value.indexOf('struct') >= 0 && enableSkeleton()) {
        let struct = appSessionStore(sessionSettingKey(trans.url));
        if (struct) {
            trans.title = get(struct, 'title');
            trans.forms = get(struct, 'forms');
            trans.current = get(struct, 'current');
            trans.groups = get(struct, 'groups');
            trans.groupCurrent = get(struct, 'groupCurrent');
            store.dispatch('poppy/SetTitle', trans.title);
            queryRef.value = 'data';
        }
    }

    apiPyRequest(trans.url, {
        _query: queryRef.value
    }).then(({ data }) => {
        if (queryRef.value.indexOf('struct') >= 0) {
            trans.title = get(data, 'title');
            trans.forms = get(data, 'forms');
            trans.current = String(first(keys(trans.forms)))
            trans.groups = get(data, 'groups');
            trans.groupCurrent = Number(findKey(trans.groups, (item: any) => {
                return trans.url === get(item, 'path', '')
            })).toString();

            // cached trans;
            const { title, forms, current, groups, groupCurrent } = trans;
            appSessionStore(sessionSettingKey(trans.url), {
                title, forms, current, groups, groupCurrent
            })
            store.dispatch('poppy/SetTitle', trans.title);
        }

        // 数据每次都会获取
        trans.models = get(data, 'models');
    })
}

/**
 * 分组切换, 重新请求结构
 * @param form
 */
const onGroupClick = (form: any) => {
    let group = find(trans.groups, (item, key) => key == form.index);
    router.push({
        query: {
            group: base64Encode(get(group, 'path', ''))
        }
    }).then(() => {
        queryRef.value = 'struct,data';
        doRequest();
    })
}

const onSubmit = (data: any) => {
    trans.url = getUrl();
    set(data, '_query', 'submit');
    apiPyRequest(trans.url, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });

        pyGlobalMotion(data);
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
