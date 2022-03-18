<template>
    <mavon-editor ref="md" :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)" @imgAdd="onImageAdd"/>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { urlToFile } from '@/framework/utils/helper';
import { apiPySystemUploadImage } from '@/framework/services/poppy';
import { first, get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const md = <Ref>ref()

const onImageAdd = (name: string, file: any) => {
    urlToFile(file.miniurl).then((f) => {
        apiPySystemUploadImage(f).then((resp) => {
            const { data } = resp;
            if (get(data, 'url', []).length) {
                let url = first(get(data, 'url', []));
                md.value.$img2Url(name, url)
            }
        })
    })
}

const emit = defineEmits([
    'update:modelValue'
])
</script>
