<template>
    <div :class="{'text-ellipsis' : ellipsis}" @click="onCopy" :title="copyable ? '点击复制' : ''">
        <ElTooltip v-model:visible="disabled" content="已复制" placement="left" effect="light">
            {{ isObjectLike(value) ? JSON.stringify(value) : value }}
        </ElTooltip>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { isObjectLike } from "lodash-es";
import useClipboard from "vue-clipboard3";

const props = defineProps({
    ellipsis: {
        type: Boolean,
        default: false
    },
    copyable: {
        type: Boolean,
        default: false
    },
    value: {
        type: [String, Number, Array, Object],
        default: ''
    }
})
const disabled = ref(false);
const { toClipboard } = useClipboard()
const onCopy = async () => {
    if (!props.copyable) {
        return;
    }
    await toClipboard(String(props.value));
    disabled.value = true;
    setTimeout(() => {
        disabled.value = false
    }, 2000)
}

</script>
<style lang="less" scoped>
.text-ellipsis {
    cursor: pointer;
}

</style>
