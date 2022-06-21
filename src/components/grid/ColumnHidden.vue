<template>
    <template v-if="refView">
        {{ refContent }}
    </template>
    <template v-else>
        <div v-loading="refLoading" v-if="get(value, 'value')" class="table-col-hide" :class="{pointer : get(attr, 'query')}"
            @click="viewContent">
            {{ get(value, 'value') }}
        </div>
        <div v-loading="refLoading" v-else class="table-col-hide" @click="viewContent">
            <span class="material-symbols-outlined">visibility_off</span>
        </div>
    </template>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { get } from "lodash-es";
import { apiPyRequest } from "@/services/poppy";
import { toast } from "@/utils/util";

const props = defineProps({
    field: {
        type: String,
        required: true
    },
    attr: {
        type: Object,
        default: () => ({})
    },
    value: {
        type: [String, Number, Array, Object],
        default: ''
    },
    pkId: {
        type: [String, Number],
        default: ''
    }
})
const refContent = ref('');
const refView = ref(false);
const refLoading = ref(false);

watch(() => props.pkId, () => {
    refContent.value = '';
    refView.value = false;
})

const viewContent = () => {
    if (!props.pkId) {
        toast('未定义主键');
        return;
    }
    let query = get(props.attr, 'query');
    if (!query) {
        toast('未定义查询网址');
        return;
    }
    refLoading.value = true;
    apiPyRequest(query, {
        _pk: props.pkId,
        _field: get(props.attr, 'field') ? get(props.attr, 'field') : props.field,
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
    &.pointer{
        cursor: pointer;
    }
}

</style>
