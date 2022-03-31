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

                <ElTabs v-model="trans.active" :closable="certs.length > 1" @edit="onTabEdit">
                    <ElTabPane v-for="cert in certs" :label="get(cert, 'label')" :name="get(cert, 'label')" :key="cert">

                        <ElInput :model-value="cert.label" @update:model-value="updateCertValue"/>

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
                        <div style="padding-top: 0.5rem">
                            <ElButton type="warning" plain @click="addHeader(cert)">添加 Header</ElButton>
                            <ElButton type="primary" plain @click="addParam(cert)">添加 Param</ElButton>
                            <ElButton type="info" @click="setDefault(cert)">设置默认</ElButton>
                        </div>
                        <ElDivider>凭证类型</ElDivider>
                        <ElRadioGroup :model-value="cert.type" @update:model-value="changeType">
                            <ElRadioButton label="user">用户</ElRadioButton>
                            <ElRadioButton label="backend">后台</ElRadioButton>
                            <ElRadioButton label="develop">开发者</ElRadioButton>
                        </ElRadioGroup>
                        <ElAlert style="margin-top: 0.5rem;" title="当前凭证的数据默认取已登录的后台/Develop账号缓存(当类型匹配时候), 需要显式通过 Authorization:Bearer {token} 覆盖"
                            type="warning" :closable="false"/>
                    </ElTabPane>
                </ElTabs>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/services/store';
import { filter, first, get, indexOf, map } from "lodash-es";
import { localStore, toast } from "@/services/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { pyStorageCerts, pyStorageKey } from "@/services/utils/conf";
import { emitter } from "@/services/bus/mitt";

const removeHeader = (header: any) => {
    certs.value = map(certs.value, function (item: any) {
        if (item.label === trans.active) {
            let index = indexOf(get(item, 'headers'), header);
            if (index > -1) {
                item.headers.splice(index, 1);
            }
        }
        return item;
    })
}

const updateCertValue = (value: any) => {
    if (value === '') {
        return;
    }
    certs.value = map(certs.value, function (item: any) {
        if (item.label === trans.active) {
            item.label = value;
        }
        return item;
    })
    trans.active = value;
    emitter.emit('dev:apidoc-header', value);
}

const removeParam = (param: any) => {
    certs.value = map(certs.value, function (item: any) {
        if (item.label === trans.active) {
            let index = indexOf(get(item, 'params'), param);
            if (index > -1) {
                item.params.splice(index, 1);
            }
        }
        return item;
    })
}

const changeType = (type: any) => {
    certs.value = map(certs.value, function (cert) {
        if (cert.label === trans.active) {
            cert.type = type;
        }
        return cert;
    })
}

const setDefault = (header: any) => {
    localStore(pyStorageKey.certCurrent, get(header, 'label'));
    emitter.emit('dev:apidoc-header', get(header, 'label'));
}

const onTabEdit = (label: string) => {
    certs.value = filter(certs.value, function (cert) {
        return cert.label !== label
    })
    trans.active = get(first(certs.value), 'label')
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


const certs: any = ref([]);
const trans = reactive({
    active: '默认',
    cert: '',
})
const addCert = () => {
    if (!trans.cert) {
        toast('请输入凭证', true);
        return;
    }
    let allCerts = filter(certs.value, function (cert) {
        return cert.label === trans.cert
    })
    if (allCerts.length > 0) {
        toast('已存在凭证, 无需添加', true);
        return;
    }
    certs.value.push({
        label: trans.cert,
        type: 'user',
        headers: [],
        params: [],
    })
}
watch(() => certs, () => {
    localStore(pyStorageCerts(), certs.value)
}, { deep: true })


onMounted(() => {
    let hds = [
        {
            label: '默认',
            headers: [{ key: '', value: 'value' }],
            params: [{ key: '', value: 'value' }]
        }
    ]
    let storeHeaders: any = localStore(pyStorageCerts())
    if (storeHeaders) {
        hds = storeHeaders
    }
    certs.value = hds;
    if (localStore(pyStorageKey.certCurrent)) {
        trans.active = String(localStore(pyStorageKey.certCurrent));
    }
})

const router = useRouter();
const store = useStore();
</script>

<style lang="less" scoped>
.doc-header {
    padding: 0.2rem 0.5rem;
    min-width: 300px;
}
</style>
