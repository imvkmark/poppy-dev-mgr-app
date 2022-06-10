<template>
    <template v-if="refView">
        {{ refContent }}
    </template>
    <template v-else>
        <div v-loading="refLoading" v-if="get(value, 'value')" class="table-col-hide" @click="viewContent">
            {{ get(value, 'value') }}
        </div>
        <div v-loading="refLoading" v-else class="table-col-hide" @click="viewContent">
            <ElIcon>
                <Hide/>
            </ElIcon>
        </div>
    </template>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { get } from "lodash-es";
import { Hide } from "@element-plus/icons-vue";
import { apiPyRequest } from "@/services/poppy";
import { toast } from "@/utils/util";

const props = defineProps({
    value: {
        type: [String, Number, Array, Object],
        default: ''
    },
    pk: {
        type: [String, Number],
        default: ''
    }
})
const refContent = ref('');
const refView = ref(false);
const refLoading = ref(false);

watch(() => props.pk, () => {
    refContent.value = '';
    refView.value = false;
})

const viewContent = () => {
    if (!props.pk) {
        toast('未定义主键');
        return;
    }
    let query = get(props.value, 'query');
    if (!query) {
        toast('未定义查询网址');
        return;
    }
    refLoading.value = true;
    apiPyRequest(query, {
        _pk: props.pk,
        _field: get(props.value, 'field'),
    }).then(({ success, message, data }) => {
        refLoading.value = false;
        if (!success) {
            toast(message);
            return;
        }
        refContent.value = data;
        refView.value = true;
    })
}

</script>
<style lang="less" scoped>
.table-col-hide {
    font-size: 14px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

</style>
