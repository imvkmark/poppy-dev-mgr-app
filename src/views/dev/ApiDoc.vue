<template>
    <div class="group">
        <ElScrollbar>
            <div class="group-search">
                <h3>接口查询</h3>
                <ElInput v-model="kw" clearable placeholder="输入关键词来查询"/>
            </div>
            <template v-for="(items, key) in trans.groups" :key="key">
                <h4>{{ key }}</h4>
                <ul>
                    <template v-for="(item, k) in items" :key="k">
                        <li @click="selectUrl(get(item, 'url'))" :class="{active: trans.url === get(item, 'url')}">
                            <span class="text-ellipsis">{{ get(item, 'title') }} {{ get(item, 'description') ? '-' + get(item, 'description') : '' }} </span>
                            <span class="group-url">{{ get(item, 'url') }}</span>
                        </li>
                    </template>
                </ul>
            </template>
        </ElScrollbar>
    </div>
    <div class="form">
        <h3>
            请求参数
            <ElTag size="small" type="success">凭证:
                <template v-if="trans.cert">{{ trans.cert }}</template>
                <template v-else>无</template>
            </ElTag>
            <span class="form-setting">
                <XIcon type="setting" @click="onHeaderClick"/>
            </span>
        </h3>
        <h4>{{ trans.title }}</h4>
        <p v-if="trans.description">
            {{ trans.description }}
        </p>
        <p>
            <ElTag type="info">{{ trans.method }}</ElTag>
            <ElTag type="warning"> {{ trans.url }}</ElTag>
        </p>
        <ElForm label-position="top" ref="formRef" class="form-form" :model="req" @keyup.enter="onRequest">
            <ElFormItem v-for="param in parameters" :key="param">
                <FieldText v-model="req[get(param, 'field')]"/>
                <template #label>
                    <span class="text-ellipsis">
                        <span class="required" v-if="!get(param, 'optional', false)">{{ !get(param, 'optional', false) ? '*' : '' }}</span>
                        {{ get(param, 'title') }} <em v-html="get(param, 'description')"/> </span>
                </template>
            </ElFormItem>
            <div class="request">
                <ElButton type="warning" @click="onRequest">请求</ElButton>
            </div>
        </ElForm>
    </div>
    <div class="result">
        <h3>请求结果和文档</h3>
        <ElTabs v-model="trans.resultTab">
            <ElTabPane label="请求结果" name="result">
                <ElAlert style="margin-bottom: 0.5rem;" v-if="trans.message" :title="trans.message" :type="trans.status > 200 ? 'error' : 'success'"
                    :closable="false"></ElAlert>
                <JsonViewer v-if="trans.result" :value="trans.result" boxed :expanded="true" copyable/>
            </ElTabPane>
            <ElTabPane label="文档" name="document">
                # todo 待解析
            </ElTabPane>
        </ElTabs>
    </div>

    <ElDrawer v-model="trans.visible" title="设置凭证">
        <DevApiDocHeader/>
    </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useStore } from '@/services/store';
import { useRouter } from 'vue-router';
import request from "@/services/utils/request";
import { each, filter, find, first, get, groupBy, isEmpty, merge, set } from "lodash-es";
import { base64Decode, base64Encode } from "@/services/utils/helper";
import FieldText from "@/components/form/FieldText.vue";
import { ElForm } from "element-plus/es";
import DevApiDocHeader from "@/components/dev/DevApiDocCert.vue";
import { pyStorageCerts, pyStorageKey } from "@/services/utils/conf";
import { localStore } from "@/services/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { emitter } from "@/services/bus/mitt";

const store = useStore();
const router = useRouter();
const apidoc = ref([]);
const formRef: any = ref<InstanceType<typeof ElForm>>();
const kw = ref('');
const def = ref({});
const req = ref({});
const parameters = computed(() => {
    return get(def.value, 'parameter.fields.Parameter', []);
})

emitter.on('dev:apidoc-header', (label: any) => {
    localStore(pyStorageKey.certCurrent, label);
    trans.cert = label;
})

const trans = reactive({
    groups: computed(() => {
        let filtered = filter(apidoc.value, (item) => {
            let title: string = get(item, 'title', '');
            let description: string = get(item, 'description', '');
            let pinyin: string = get(item, 'pinyin', '');
            let name: string = get(item, 'name', '');
            let url: string = get(item, 'url', '');
            if (!kw.value) {
                return true;
            }
            return title.indexOf(kw.value) > -1
                ||
                description.indexOf(kw.value) > -1
                ||
                pinyin.indexOf(kw.value) > -1
                ||
                url.indexOf(kw.value) > -1
                ||
                name.indexOf(kw.value) > -1;
        })
        return groupBy(filtered, (item) => {
            return get(item, 'group');
        })
    }),
    url: computed(() => {
        return get(def.value, 'url');
    }),
    title: computed(() => {
        return get(def.value, 'title');
    }),
    method: computed(() => {
        return get(def.value, 'type');
    }),
    description: computed(() => {
        return get(def.value, 'description');
    }),
    result: null,
    visible: false,
    resultTab: 'result',
    certs: null,
    message: '',
    status: 200,
    cert: '',
});

const onHeaderClick = () => {
    trans.visible = !trans.visible;
}

const selectUrl = (url: string) => {
    def.value = find(apidoc.value, (item: any) => {
        return get(item, 'url') === url;
    });
    router.push({
        query: {
            url: base64Encode(url)
        }
    })
}

const fetchApiDoc = () => {
    request({
        url: '/api/mgr-dev/apidoc/json',
        params: {
            type: 'web'
        }
    }, 'develop').then(({ data }) => {
        apidoc.value = get(data, 'apidoc');

        let url = String(get(router.currentRoute.value.query, 'url', ''));
        if (url) {
            let index = base64Decode(url);
            selectUrl(index);
        } else {
            let item = first(apidoc.value);
            let index = String(get(item, 'url'));
            selectUrl(index);
        }
    });
}

const onRequest = () => {
    formRef.value.validate().then(() => {
        let certs = localStore(pyStorageCerts());
        let headers = {};
        let params = {};
        let type = '';
        if (certs) {
            let cert = find(certs, (item: any) => {
                return item.label = trans.cert;
            })
            type = get(cert, 'type', '');

            // 复写 params
            if (!isEmpty(get(cert, 'params', []))) {
                each(get(cert, 'params', []), (value) => {
                    set(params, get(value, 'key'), get(value, 'value'));
                })
            }

            // 复写 headers
            if (!isEmpty(get(cert, 'headers', []))) {
                each(get(cert, 'headers', []), (value) => {
                    set(headers, get(value, 'key'), get(value, 'value'));
                })
            }
        }

        let start = (new Date()).getTime();
        request({
            url: trans.url,
            params: merge(req.value, params),
            method: trans.method,
            headers: headers
        }, type).then(({ status, data, message }) => {
            let end = (new Date()).getTime();
            let result = {
                status,
                message
            }
            if (!isEmpty(data)) {
                set(result, 'data', data);
            }

            let timing = end - start;
            trans.resultTab = 'result';
            trans.status = 200;
            trans.message = `status : ${status}, time: ${timing}ms , message: ${message}`;
            trans.result = result;
        }).catch(({ message, status }) => {
            let end = (new Date()).getTime();
            let timing = end - start;
            trans.status = status;
            trans.result = null;
            trans.message = `status : ${status}, time: ${timing}ms, message: ${message}`;
        })
    }).catch(() => {
    });

}
onMounted(() => {
    fetchApiDoc();
    trans.cert = String(localStore(pyStorageKey.certCurrent) ? localStore(pyStorageKey.certCurrent) : '');
})

onUnmounted(() => {
    emitter.off('dev:apidoc-header')
})

</script>

<style scoped lang="less">

.group {
    width: 260px;
    height: 100vh;
    background: #fff;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    div.group-search {
        box-sizing: content-box;
        padding: 0.3rem 0;
        position: sticky;
        top: 0;
        background: #fff;
        .el-input {
            width: 96%;
        }
    }
    h3 {
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
    }
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
    }
    ul {
        font-size: 13px;
        padding: 0.3rem 0.5rem 0.3rem 0.1rem;
        margin: 0;
        li {
            cursor: pointer;
            border-left: 3px transparent solid;
            &.active {
                background: #f5f5f5;
                border-left: 3px solid var(--wc-color-primary);
            }
            line-height: 1.3;
            padding: 0.2rem 0.2rem 0.2rem 0.4rem;
            .group-url {
                line-height: 1.4;
                font-size: 12px;
            }

        }
    }
}

.form {
    width: 300px;
    border-right: 1px solid #eee;
    height: 100vh;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    position: relative;
    h3 {
        padding: 0.3rem 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
        position: relative;
        .form-setting {
            position: absolute;
            right: 0.3rem;
            top: 0.5rem;
            cursor: pointer;
            &:hover {
                color: var(--wc-color-primary);
            }
        }
    }
    > h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
    }
    > p {
        font-size: 12px;
        margin: 0;
    }
    em {
        font-style: normal;
    }
    .required {
        color: red;
    }
    .request {
        position: absolute;
        bottom: 5px;
        left: 5px;
        width: 300px;
    }
    .form-form {
        padding-right: 0.3rem;
    }

}

.result {
    background: #fff;
    height: 100vh;
    padding: 0.3rem 0 0.3rem 0.5rem;
    box-sizing: border-box;
    position: relative;
    width: calc(100vw - 610px);
    h3 {
        padding: 0.3rem 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 32px;
        height: 32px;
        margin: 0;
    }
}
</style>
