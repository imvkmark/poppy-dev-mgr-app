<template>
    <div :class="{'text-ellipsis' : ellipsis}" @click="onCopy" :title="copyable ? '点击复制' : ''">
        <ElTooltip v-model:visible="disabled" content="已复制" placement="left" effect="light">
            {{ value }}
        </ElTooltip>
    </div>
</template>
<script lang="ts" setup>
import { copyText } from 'vue3-clipboard'
import { toast } from "@/framework/utils/util";
import { ref } from "vue";

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
        type: [String, Number],
        default: ''
    }
})
const disabled = ref(false);
const onCopy = () => {
    if (!props.copyable) {
        return;
    }
    copyText(props.value, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error, false)
        } else {
            disabled.value = true;
            setTimeout(() => {
                disabled.value = false
            }, 2000)
        }
    })
}

</script>
<style lang="less" scoped>
.text-ellipsis {
    cursor: pointer;
}

</style>
