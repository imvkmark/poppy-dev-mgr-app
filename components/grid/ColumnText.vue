<template>
    <ElPopover :width="200" trigger="hover" v-if="ellipsis" placement="top-start">
        <template #reference>
            <div :class="{'text-ellipsis' : true}" style="cursor: pointer">{{ value }}</div>
        </template>
        {{ value }}
    </ElPopover>
    <div v-else>{{ value }}</div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
    ellipsis: {
        type: Boolean,
        default: false
    },
    value: {
        type: [String, Number],
        default: ''
    }
})

const trans = reactive({
    isIndeterminate: true,
    checkAll: false,
    allKeys: <any>[]
})

const emit = defineEmits([
    'change'
])

const stripTags = (html: string) => {
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
}

const val = ref(<any>[]);

watch(() => val.value, (newVal) => {
    trans.isIndeterminate = newVal.length > 0 && newVal.length < trans.allKeys.length;
    trans.checkAll = newVal.length === trans.allKeys.length;

    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.value ? props.value : '';
})
</script>
<style lang="less" scoped>

.check-all {
    position: absolute;
    top: 0;
    left: 0;
}

.check-item {
    padding-top: 25px;

    &.check-button {
        padding-top: 35px;
    }
}
</style>
