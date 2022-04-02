<template>
    <div class="doc-header">
        <ElRow :gutter="4">
            <ElCol :span="16">
                <ElInput v-model="trans.cert"/>
            </ElCol>
            <ElCol :span="8">
                <ElButton type="primary" class="py--block" @click="addCert">添加凭证</ElButton>
            </ElCol>
        </ElRow>
        <ElRow :gutter="4">
            <ElCol>
                <ElTabs v-model="trans.current" :closable="certsRef.length > 1" @edit="onTabEdit">
                    <ElTabPane v-for="cert in certsRef" :label="get(cert, 'label')" :name="get(cert, 'label')" :key="cert">
                        <ElInput :model-value="cert.label" @update:model-value="updateCertLabel">
                            <template #prepend>凭证名称</template>
                        </ElInput>
                        <ElInput :model-value="cert.url" @update:model-value="updateCertUrl" style="margin-top:0.2rem">
                            <template #prepend>请求地址</template>
                        </ElInput>
                        <ElButton type="warning" style="margin-top:0.2rem" plain @click="addHeader(cert)">添加 Header</ElButton>
                        <ElTable :data="cert['headers']">
                            <ElTableColumn label="Header" width="100" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.key" placeholder="name"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn label="值" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.value" placeholder="value"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn width="60" align="center">
                                <template #default="scope">
                                    <ElButton circle type="danger" size="small" plain @click="removeHeader(scope.row)">
                                        <XIcon type="delete"/>
                                    </ElButton>
                                </template>
                            </ElTableColumn>
                        </ElTable>
                        <ElButton type="primary" style="margin-top:0.2rem" plain @click="addParam(cert)">添加 Param</ElButton>
                        <ElTable :data="cert['params']">
                            <ElTableColumn label="参数" width="100" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.key" placeholder="name"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn label="值" align="center">
                                <template #default="scope">
                                    <ElInput v-model="scope.row.value" placeholder="value"/>
                                </template>
                            </ElTableColumn>
                            <ElTableColumn width="60" align="center">
                                <template #default="scope">
                                    <ElButton circle type="danger" size="small" plain @click="removeParam(scope.row)">
                                        <XIcon type="delete"/>
                                    </ElButton>
                                </template>
                            </ElTableColumn>
                        </ElTable>
                        <ElButton style="margin-top: 0.2rem;" type="primary" @click="setDefault(cert)">激活凭证</ElButton>
                        <ElAlert style="margin-top: 0.2rem;" title="凭证不绑定接口"
                            type="warning" :closable="false"/>
                    </ElTabPane>
                </ElTabs>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { filter, find, first, get, indexOf, map, set } from "lodash-es";
import { localStore, toast } from "@/services/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { pyStorageDevApidocCertsKey } from "@/services/utils/conf";
import { emitter } from "@/services/bus/mitt";

const removeHeader = (header: any) => {
    certsRef.value = map(certsRef.value, function (item: any) {
        if (get(item, 'label') === trans.current) {
            let index = indexOf(get(item, 'headers'), header);
            if (index > -1) {
                item.headers.splice(index, 1);
            }
        }
        return item;
    })
}

const updateCertLabel = (value: any) => {
    if (value === '') {
        return;
    }
    certsRef.value = map(certsRef.value, function (item: any) {
        if (get(item, 'label') === trans.current) {
            set(item, 'label', value);
        }
        return item;
    });
    trans.current = value;
}
const updateCertUrl = (value: any) => {
    if (value === '') {
        return;
    }
    certsRef.value = map(certsRef.value, function (item: any) {
        if (get(item, 'active')) {
            set(item, 'url', value);
        }
        return item;
    })
}

const removeParam = (param: any) => {
    certsRef.value = map(certsRef.value, function (item: any) {
        if (item.label === trans.active) {
            let index = indexOf(get(item, 'params'), param);
            if (index > -1) {
                item.params.splice(index, 1);
            }
        }
        return item;
    })
}

const setDefault = (cert: any) => {
    let label = get(cert, 'label');
    certsRef.value = map(certsRef.value, function (item: any) {
        if (get(item, 'label') === label) {
            set(item, 'active', true);
        } else {
            set(item, 'active', false);
        }
        return item;
    })
}

const onTabEdit = (label: string) => {
    certsRef.value = filter(certsRef.value, function (cert) {
        return cert.label !== label
    })
    trans.active = get(first(certsRef.value), 'label')
}

const addHeader = (cert: any) => {
    cert['headers'].push({
        key: '',
        value: '',
    })
}
const addParam = (cert: any) => {
    cert['params'].push({
        key: '',
        value: '',
    })
}


const certsRef: any = ref([]);
const trans = reactive({
    active: computed(() => {
        return get(find(certsRef.value, { active: true }), 'label')
    }),
    cert: '',
    current: ''
})
const addCert = () => {
    if (!trans.cert) {
        toast('请输入凭证', true);
        return;
    }
    let allCerts = filter(certsRef.value, function (cert) {
        return cert.label === trans.cert
    })
    if (allCerts.length > 0) {
        toast('已存在凭证, 无需添加', true);
        return;
    }
    certsRef.value.push({
        label: trans.cert,
        active: false,
        type: 'user',
        headers: [],
        params: [],
    })
}

// 同步Certs
watch(() => certsRef.value, () => {
    localStore(pyStorageDevApidocCertsKey(), certsRef.value);
    emitter.emit('dev:apidoc-certs-update', certsRef.value);
}, { deep: true })


onMounted(() => {
    let hds = [
        {
            label: '默认',
            headers: [{ key: '', value: '' }],
            params: [{ key: '', value: '' }]
        }
    ]
    let storeHeaders: any = localStore(pyStorageDevApidocCertsKey())
    if (storeHeaders) {
        hds = storeHeaders
    }
    certsRef.value = hds;
    trans.current = trans.active;

})
</script>

<style lang="less" scoped>
.doc-header {
    padding: 0.2rem 0.5rem;
    min-width: 300px;
}
</style>
