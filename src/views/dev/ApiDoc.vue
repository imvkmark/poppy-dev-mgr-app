<template>
    <div class="dev--apidoc">
        <div class="group">
            <ElScrollbar>
                <div class="group-search">
                    <h3>
                        接口查询 <small>{{ get(source.active, 'source') }}</small>
                        <span class="group-setting">
                            <XIcon type="setting" @click="manageSource"/>
                        </span>
                    </h3>
                    <ElInput v-model="source.kw" clearable placeholder="输入关键词来查询"/>
                </div>
                <template v-for="(items, key) in sourceGrouped" :key="key">
                    <h4>{{ key }}</h4>
                    <ul>
                        <template v-for="(item, k) in items" :key="k">
                            <li @click="selectUrl(get(item, 'url'))" :class="{active: trans.url === get(item, 'url')}">
                                <span class="text-ellipsis">{{
                                        get(item, 'title')
                                    }} {{ get(item, 'description') ? '-' + stripTags(get(item, 'description')) : '' }} </span>
                                <span class="group-url">{{ get(item, 'url') }}</span>
                            </li>
                        </template>
                    </ul>
                </template>
            </ElScrollbar>
        </div>
        <div class="form">
            <ElScrollbar>
                <h3>
                    请求参数
                    <ElTag size="small" type="success">凭证:
                        <template v-if="get(api.cert, 'label')">{{ get(api.cert, 'label') }}</template>
                        <template v-else>无</template>
                    </ElTag>
                    <span class="form-setting">
                    <XIcon type="setting" @click="manageCert"/>
                </span>
                </h3>
                <h4>{{ api.title }}</h4>
                <p v-if="api.description">
                    {{ stripTags(api.description) }}
                </p>
                <p>
                    <ElTag type="info">{{ api.method }}</ElTag>
                    <ElTag type="warning"> {{ api.urlReplaced }}</ElTag>
                </p>
                <ElForm label-position="top" class="form-form" @keyup.enter="onRequest">
                    <ElDivider v-if="api.parameters.length">参数</ElDivider>
                    <ElFormItem v-for="param in api.parameters" :key="param">
                        <FieldText v-model="apiParamsRef[get(param, 'field')]"/>
                        <template #label>
                    <span class="text-ellipsis">
                        <span class="required" v-if="!get(param, 'optional', false)">{{ !get(param, 'optional', false) ? '*' : '' }}</span>
                       {{ get(param, 'field') }}  ({{ get(param, 'type') }}) {{ get(param, 'title') }} <em
                        v-html="stripTags(get(param, 'description'))"/> </span>
                        </template>
                    </ElFormItem>
                    <ElDivider v-if="api.queries.length">查询</ElDivider>
                    <ElFormItem v-for="query in api.queries" :key="query" class="apidoc-request_label">
                        <FieldText v-model="apiQueryRef[get(query, 'field')]"/>
                        <template #label>
                            <span class="text-ellipsis">
                                <span class="required" v-if="!get(query, 'optional', false)">{{ !get(query, 'optional', false) ? '*' : '' }}</span>
                                {{ get(query, 'field') }}({{ get(query, 'type') }}) {{ get(query, 'title') }} <em
                                v-html="stripTags(get(query, 'description'))"/> </span>
                        </template>
                    </ElFormItem>
                    <div class="request">
                        <ElButton type="warning" @click="onRequest">请求</ElButton>
                    </div>
                </ElForm>
            </ElScrollbar>
        </div>
        <div class="result">
            <h3>请求结果和文档</h3>
            <ElTabs v-model="result.tab">
                <ElTabPane label="请求结果" name="result">
                    <ElAlert style="margin-bottom: 0.5rem;" v-if="result.message" :title="result.message" :type="result.status > 200 ? 'error' : 'success'"
                        :closable="false"/>
                    <JsonViewer :value="resultResp" boxed :expanded="true" copyable/>
                </ElTabPane>
                <ElTabPane label="文档" name="document" v-if="!isEmpty(api.document)">
                    <ElTable :data="api.document">
                        <ElTableColumn label="字段" width="160" align="center" prop="field">
                        </ElTableColumn>
                        <ElTableColumn label="类型" width="100" align="center">
                            <template #default="scope">
                                {{ scope.row.type }} <span v-if="scope.row.optional" style="color: red">*</span>
                            </template>
                        </ElTableColumn>
                        <ElTableColumn label="说明">
                            <template #default="scope">
                                {{ stripTags(scope.row.description) }}
                            </template>
                        </ElTableColumn>
                    </ElTable>
                </ElTabPane>
                <ElTabPane label="示例" name="sample" v-if="!isEmpty(api.sample)">
                    <template v-for="sample in api.sample" :key="sample">
                        <h4>{{ get(sample, 'title') }}</h4>
                        <pre class="form-sample" v-html="get(sample, 'content')"></pre>
                    </template>
                </ElTabPane>
            </ElTabs>
        </div>
    </div>
    <ElDrawer v-model="trans.visible" :title="trans.drawer === 'cert' ? '设置凭证' : '接口来源'">
        <DevApiDocCert v-if="trans.drawer === 'cert'"/>
        <DevApiDocSource v-if="trans.drawer === 'source'"/>
    </ElDrawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useStore } from '@/services/store';
import { useRouter } from 'vue-router';
import request from "@/services/utils/request";
import apiRequest from "@/services/utils/dev/request";
import { each, filter, find, first, get, groupBy, isEmpty, map, merge, set } from "lodash-es";
import { base64Decode, base64Encode, pyWarning, stripTags } from "@/services/utils/helper";
import FieldText from "@/components/form/FieldText.vue";
import { ElForm } from "element-plus/es";
import DevApiDocCert from "@/components/dev/DevApiDocCerts.vue";
import { pyStorageDevApidocCertsKey, pyStorageDevApidocSourcesKey } from "@/services/utils/conf";
import { baseUrl, localStore, toast } from "@/services/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { emitter } from "@/services/bus/mitt";
import DevApiDocSource from "@/components/dev/DevApiDocSources.vue";

const store = useStore();
const router = useRouter();

// sources
const source = reactive({
    kw: '',          // 查询关键字
    content: [],     // '所有定义
    active: computed(() => {  // 当前激活的接口
        return find(sourceUrlsRef.value, { active: true });
    }),
})
// 当前接口定义
const sourceUrlsRef: any = ref([]);
// 分组过的接口定义
const sourceGrouped = computed(() => {
    let filtered = filter(source.content, (item) => {
        let title: string = get(item, 'title', '');
        let description: string = get(item, 'description', '');
        let name: string = get(item, 'name', '');
        let url: string = get(item, 'url', '');
        if (!source.kw) {
            return true;
        }
        return title.indexOf(source.kw) > -1
            ||
            description.indexOf(source.kw) > -1
            ||
            url.indexOf(source.kw) > -1
            ||
            name.indexOf(source.kw) > -1;
    })
    return groupBy(filtered, (item) => {
        return get(item, 'group');
    })
})


// api
const apiRef: any = ref({});
const apiParamsRef = ref({});
const apiQueryRef = ref({});
const apiCerts: any = ref([]);
const api = reactive({
    url: computed(() => {
        return get(apiRef.value, 'url');
    }),
    urlReplaced: computed(() => {
        let url: string = get(apiRef.value, 'url');
        map(apiParamsRef.value, (value, key) => {
            console.log(value, key);
            if (value) {
                url = url.replace(`:${key}`, value);
            }
        })
        return url;
    }),
    title: computed(() => {
        return get(apiRef.value, 'title');
    }),
    method: computed(() => {
        return get(apiRef.value, 'type');
    }),
    description: computed(() => {
        return get(apiRef.value, 'description');
    }),
    sample: computed(() => {
        return get(apiRef.value, 'success.examples') || [];
    }),
    document: computed(() => {
        return get(apiRef.value, 'success.fields') ? get(apiRef.value, 'success.fields')['Success 200'] : [];
    }),
    parameters: computed(() => {
        return get(apiRef.value, 'parameter.fields.Parameter', []);
    }),
    queries: computed(() => {
        return get(apiRef.value, 'query', []);
    }),
    cert: computed(() => {
        return find(apiCerts.value, { active: true });
    }),
})

const resultResp: any = ref({});
const result = reactive({
    tab: 'result',
    status: 0,
    message: ''
})

emitter.on('dev:apidoc-certs-update', (certs: any) => {
    apiCerts.value = certs;
})
emitter.on('dev:apidoc-source-active', (row: any) => {
    let url = get(row, 'url');
    fetchApiDoc(url);
})
emitter.on('dev:apidoc-sources-updated', (sources: any) => {
    sourceUrlsRef.value = sources
})

const trans = reactive({
    visible: false,
    drawer: '',
});

const manageCert = () => {
    trans.visible = !trans.visible;
    trans.drawer = 'cert';
}

const manageSource = () => {
    trans.visible = !trans.visible;
    trans.drawer = 'source';
}

const selectUrl = (clk: string = '') => {
    let url = clk ? clk : (get(router.currentRoute.value.query, 'url', '') ? base64Decode(String(get(router.currentRoute.value.query, 'url', ''))): '');
    pyWarning(url);
    apiRef.value = find(source.content, (item: any) => {
        return get(item, 'url') === url;
    });
    if (isEmpty(apiRef.value)) {
        apiRef.value = first(source.content);
        url = get(apiRef.value, 'url');
    }
    result.tab = 'result';
    resultResp.value = {};
    result.message = '';
    router.push({
        query: {
            url: base64Encode(url)
        }
    })
}

const fetchApiDoc = (url: string = '') => {
    let reqUrl;
    if (url) {
        reqUrl = url;
    } else {
        if (!isEmpty(source.active)) {
            reqUrl = get(source.active, 'url');
        } else {
            reqUrl = baseUrl('/api/mgr-dev/apidoc/json', { type: 'web' });
        }
    }
    request({
        url: reqUrl,
    }, 'develop').then(({ data }) => {
        source.content = eval(get(data, 'apidoc'));

        if (isEmpty(localStore(pyStorageDevApidocSourcesKey()))) {
            localStore(pyStorageDevApidocSourcesKey(), get(data, 'sources'));
            sourceUrlsRef.value = get(data, 'sources');
        }
        selectUrl();
    });
}

const onRequest = () => {
    let headers = {};
    let query = {};
    let url = '';
    if (isEmpty(api.cert)) {
        toast('请选择凭证', false);
        return;
    }

    url = get(api.cert, 'url');
    if (!url) {
        toast('需要完善请求地址', false);
        return;
    }
    // 复写 params
    if (!isEmpty(get(api.cert, 'params', []))) {
        each(get(api.cert, 'params', []), (value) => {
            set(query, get(value, 'key'), get(value, 'value'));
        })
    }

    // 复写 headers
    if (!isEmpty(get(api.cert, 'headers', []))) {
        each(get(api.cert, 'headers', []), (value) => {
            if (get(value, 'key') !== '') {
                set(headers, get(value, 'key'), get(value, 'value'));
            }
        })
    }

    let start = (new Date()).getTime();

    let path = api.urlReplaced;
    if (api.urlReplaced.indexOf('/') !== 0) {
        path = `/${api.urlReplaced}`;
    }
    apiRequest({
        url: `${url}${path}`,
        params: merge(apiQueryRef.value, query),
        method: api.method,
        headers: headers
    }).then(({ status, data, message }) => {
        let end = (new Date()).getTime();
        let resp = {
            status,
            message
        }
        if (!isEmpty(data)) {
            set(resp, 'data', data);
        }

        resultResp.value = resp;

        let timing = end - start;
        result.tab = 'result';
        result.status = 200;
        result.message = `status : ${status}, time: ${timing}ms , message: ${message}`;
    }).catch(({ status, message }) => {
        let end = (new Date()).getTime();
        let timing = end - start;
        resultResp.value = {}
        result.status = status;
        result.message = `status : ${status}, time: ${timing}ms, message: ${message}`;
    })
}
onMounted(() => {
    sourceUrlsRef.value = localStore(pyStorageDevApidocSourcesKey());
    apiCerts.value = localStore(pyStorageDevApidocCertsKey());
    fetchApiDoc();

    //

})

onUnmounted(() => {
    emitter.off('dev:apidoc-certs-update')
    emitter.off('dev:apidoc-source-active')
    emitter.off('dev:apidoc-sources-updated')
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
        .group-setting {
            position: absolute;
            right: 1rem;
            top: 0.2rem;
            cursor: pointer;
            &:hover {
                color: var(--wc-color-primary);
            }
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
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
    }
    h4 + p {
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
    h4 {
        font-size: 14px;
        line-height: 26px;
        height: 26px;
        margin: 0;
        font-weight: normal;
        padding-left: 1rem;
    }
    .form-sample {
        border: 1px solid #ccc;
        padding: 0.5rem;
        margin: 0.5rem;
        border-radius: 5px;
    }
}
</style>
