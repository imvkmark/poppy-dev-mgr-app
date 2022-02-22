<template>
    <mavon-editor ref="md" v-model="val" @imgAdd="onImageAdd"/>
</template>
<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';
import { urlToFile } from '@/framework/utils/helper';
import { apiPySystemUploadImage } from '@/framework/services/poppy';
import { first, get } from 'lodash-es';

const props = defineProps({
    name: String,
    attr: Object,
    defaultValue: {
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
                console.log(md.value, 'md');
                md.value.$img2Url(name, url)
            }
        })
    })
}

const emit = defineEmits([
    'change'
])

const val: any = ref('');

watch(() => val.value, (newVal) => {
    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.defaultValue;
})
</script>
