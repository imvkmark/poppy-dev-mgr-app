<template>
    <ElUpload action="" name="file" :http-request="onUpload" list-type="picture-card" class="form-file"
        :class="{'file-max': trans.files.length >= 1}"
        :file-list="trans.files" :accept="get(attr, 'accept', '*/*')" :limit="1">
        <ElIcon>
            <Plus/>
        </ElIcon>
        <template #file="{file}">
            <div class="form-file-preview">
                <ElImage
                    v-if="includes(pyFileExtensions.images, urlExtension(file.url))" :src="file.url" alt=""/>
                <span class="el-upload-list__item-thumbnail"
                    v-else-if="includes(pyFileExtensions.video, urlExtension(file.url))">
                        <ElIcon><Film/></ElIcon>
                    </span>
                <span class="el-upload-list__item-thumbnail"
                    v-else-if="includes(pyFileExtensions.audio, urlExtension(file.url))">
                        <ElIcon><Headset/></ElIcon>
                    </span>
                <span class="el-upload-list__item-thumbnail" v-else>
                        <ElIcon><Document/></ElIcon>
                    </span>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="onPreview()">
                        <ElIcon><ZoomIn/></ElIcon>
                    </span>
                    <span class="el-upload-list__item-delete" @click="onRemove()">
                        <ElIcon><Delete/></ElIcon>
                    </span>
                </span>
            </div>
        </template>
    </ElUpload>
    <ElImageViewer :url-list="fileList" v-if="trans.preview" @close="onClosePreview"/>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { apiPySystemUploadFile } from '@/services/api/poppy';
import { Delete, Document, Film, Headset, Plus, ZoomIn } from '@element-plus/icons-vue';
import { urlExtension } from '@popjs/core/utils/helper';
import { first, get, includes, map } from 'lodash-es';
import { toast } from "@/services/utils/util";
import { pyFileExtensions } from "@/services/utils/conf";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const onUpload = ({ file }) => {
    apiPySystemUploadFile(file, get(props.attr, 'type', 'file')).then(({ success, data, message }) => {
        toast(message, success)
        if (get(data, 'url', []).length) {
            trans.files = [{
                url: String(first(get(data, 'url', []))).toString()
            }]
            emitFiles();
        }
    })
}

const trans = reactive({
    preview: false,
    files: <any>[]
})

const fileList = computed(() => {
    return map(trans.files, function (file) {
        return get(file, 'url')
    })
})


const onRemove = () => {
    trans.files = [];
    emitFiles();
}
const onPreview = () => {
    let url = get(first(trans.files), 'url');
    if (!includes(pyFileExtensions.images, urlExtension(url))) {
        window.open(url);
        return;
    }
    trans.preview = true;
}
const onClosePreview = () => {
    trans.preview = false;
}

const emit = defineEmits([
    'update:modelValue'
])


const emitFiles = () => {
    let url = '';
    if (trans.files.length > 0) {
        url = get(first(trans.files), 'url');
    }
    emit('update:modelValue', url)
}


const init = () => {
    if (props.modelValue) {
        trans.files = [{ url: props.modelValue, name: '' }]
    }
}

watch(() => props.modelValue, () => {
    init();
})

onMounted(() => {
    init();
})
</script>
