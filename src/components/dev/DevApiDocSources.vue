<template>
    <div class="source">
        <ElRow :gutter="4">
            <ElCol :span="24">
                <ElForm label-position="top">
                    <ElFormItem label="标识">
                        <ElInput v-model="trans.source" placeholder="标识"/>
                    </ElFormItem>
                    <ElFormItem label="来源地址">
                        <ElInput v-model="trans.url" placeholder="来源地址"/>
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton type="primary" class="py--block" @click="onSubmit">添加来源</ElButton>
                    </ElFormItem>
                </ElForm>
            </ElCol>
        </ElRow>
        <ElRow :gutter="4">
            <ElCol>
                <ElTable :data="sources">
                    <ElTableColumn label="Source" width="100" align="center">
                        <template #default="scope">
                            <ElInput v-model="scope.row.source" placeholder="name"/>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="Url" align="center">
                        <template #default="scope">
                            <ElInput v-model="scope.row.url" readonly placeholder="value"/>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn width="100" align="center">
                        <template #default="scope">
                            <ElButton :type="scope.row.active? 'success' : 'info'" size="small" circle @click="activeSource(scope.row)">
                                <XIcon type="check"/>
                            </ElButton>
                            <ElButton circle type="danger" size="small" plain @click="removeSource(scope.row)">
                                <XIcon type="delete"/>
                            </ElButton>
                        </template>
                    </ElTableColumn>
                </ElTable>
                <ElAlert style="margin-top: 0.5rem;" title="当前凭证的数据默认取已登录的后台/Develop账号缓存(当类型匹配时候), 需要显式通过 Authorization:Bearer {token} 覆盖"
                    type="warning" :closable="false"/>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/services/store';
import { find, get, indexOf, map, set } from "lodash-es";
import { localStore, toast } from "@/services/utils/util";
import XIcon from "@/components/element/XIcon.vue";
import { pyStorageDevApidocSourcesKey } from "@/services/utils/conf";
import { emitter } from "@/services/bus/mitt";
import { isUrl } from "@/services/utils/helper";

const sources: any = ref([]);
const trans = reactive({
    source: '',
    url: '',
})

const activeSource = (row: any) => {
    sources.value = map(sources.value, (item) => {
        if (get(item, 'source') === get(row, 'source')) {
            set(item, 'active', true);
        } else {
            set(item, 'active', false);
        }
        return item;
    });
    emitter.emit('dev:apidoc-source-active', row);
}
const removeSource = (row: any) => {
    let index = indexOf(sources.value, row);
    if (index > -1) {
        sources.value.splice(index, 1);
    }
}

const onSubmit = () => {
    if (!trans.source || !trans.url) {
        toast('请完善输入数据', false);
        return;
    }
    if (!isUrl(trans.url)) {
        toast('请输入正确的地址', false);
        return;
    }
    if (find(sources.value, { source: trans.source })) {
        toast('已存在标识, 无法添加', false);
        return;
    }
    sources.value.push({
        source: trans.source,
        url: trans.url,
        delete: true
    })
    trans.source = '';
    trans.url = '';
}

watch(() => sources.value, (val) => {
    localStore(pyStorageDevApidocSourcesKey(), val);
    emitter.emit('dev:apidoc-sources-updated', val);
}, { deep: true })


onMounted(() => {
    sources.value = localStore(pyStorageDevApidocSourcesKey()) || [];
})

const router = useRouter();
const store = useStore();
</script>

<style lang="less" scoped>
.source {
    min-width: 300px;
}
</style>
