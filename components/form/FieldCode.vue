<template>
    <div class="code">
        <pre v-html="defaultValue"></pre>
        <ElTooltip v-model:visible="disabled" content="已复制" placement="left" effect="light">
            <XIcon :class-name="{copy : true,'copy-success': !disabled}" type="copy-document" @click="copy"/>
        </ElTooltip>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import XIcon from "@/framework/components/element/XIcon.vue";
import { copyText } from 'vue3-clipboard'
import { toast } from "@/framework/utils/helper";

const props = defineProps({
    defaultValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const val = ref('');
const disabled = ref(false);
const copy = () => {
    copyText(props.defaultValue, undefined, (error: any) => {
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
.code {
    position: relative;
    .copy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    pre {
        background: #F6F8FA;
        padding: 0.5rem;
        color: #24292f;
    }
    &:hover {
        pre {
            background: #f4f4f5;
        }
        .copy {
            opacity: 1;
        }
    }
}

.copy {
    cursor: pointer;
    position: absolute;
    top: 7px;
    right: 7px;
    font-size: 18px;
}

.copy-success {
    .el-icon {
        color: #34B7FF;
    }
}
</style>
