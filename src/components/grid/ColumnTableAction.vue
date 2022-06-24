<template>
    <ElButton circle class="el-button-has-mu" size="small" v-if="includes(editable, 'add')" @click="onAdd">
        <XIcon type="mu:new_label"/>
    </ElButton>
    <ElButton circle class="el-button-has-mu" size="small" v-if="includes(editable, 'down')" @click="onDown" :disabled="isLast">
        <XIcon type="mu:arrow_downward"/>
    </ElButton>
    <ElButton circle class="el-button-has-mu" size="small" v-if="includes(editable, 'up')" @click="onUp" :disabled="isTop">
        <XIcon type="mu:arrow_upward"/>
    </ElButton>
    <ElButton circle class="el-button-has-mu" size="small" v-if="includes(editable, 'copy')" @click="onCopy">
        <XIcon type="mu:content_copy"/>
    </ElButton>
    <ElButton circle class="el-button-has-mu" type="danger" v-if="includes(editable, 'delete')" size="small" @click="onDelete">
        <XIcon type="mu:backspace"/>
    </ElButton>
</template>
<script lang="ts" setup>
import XIcon from "@/components/element/XIcon.vue";
import { includes } from "lodash-es";

const props = defineProps({
    editable: {
        type: Array,
        default: () => {
            return []
        }
    },
    isTop: {
        type: Boolean,
        default: false
    },
    isLast: {
        type: Boolean,
        default: false
    },
    pk: {
        type: String,
        required: true,
        default: ''
    }
})

const emits = defineEmits([
    'modify',
])

const onAdd = () => {
    emits('modify', {
        idx: props.pk,
        type: 'add',
    })
}
const onDelete = () => {
    emits('modify', {
        idx: props.pk,
        type: 'delete',
    })
}
const onCopy = () => {
    emits('modify', {
        idx: props.pk,
        type: 'copy',
    })
}
const onDown = () => {
    emits('modify', {
        idx: props.pk,
        type: 'down',
    })
}
const onUp = () => {
    emits('modify', {
        idx: props.pk,
        type: 'up',
    })
}

</script>
<style lang="less" scoped>

</style>
