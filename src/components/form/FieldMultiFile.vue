<template>
    <ElImageViewer :url-list="trans.fileList" :initial-index="trans.index" v-if="trans.preview" :hide-on-click-modal="true" @close="trans.preview=false"/>
    <ElUpload name="file" :http-request="onUpload" list-type="picture-card" class="form-file" multiple
        :class="{'file-max': get(attr, 'limit', 0) ? get(attr, 'limit', 0) <= files.length : false}"
        :accept="get(attr, 'accept', '*/*')" :on-exceed="onExceed" :file-list="files"
        :limit="get(attr, 'limit', 0)">
        <ElIcon>
            <Plus/>
        </ElIcon>
        <template #file="{file}">
            <div class="form-file-preview">
                <ElImage fit="contain"
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
                    <span class="el-upload-list__item-preview" @click="onPreview(file)">
                        <ElIcon><ZoomIn/></ElIcon>
                    </span>
                    <em class="el-upload-list__item-delete" @click="onRemove(file)">
                        <ElIcon><CircleCloseFilled/></ElIcon>
                    </em>
                </span>
            </div>
        </template>
    </ElUpload>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowReactive } from 'vue';
import { apiPySystemUploadImage } from '@/services/poppy';
import { CircleCloseFilled, Document, Film, Headset, Plus, ZoomIn } from '@element-plus/icons-vue';
import { urlExtension } from '@popjs/core/utils/helper';
import { each, find, first, get, includes, indexOf, map, reject, set } from 'lodash-es';
import { toast } from "@/utils/util";
import { pyFileExtensions } from "@/utils/conf";
import { UploadFile, UploadProps, UploadRequestOptions } from "element-plus";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const files = <any>ref([]);
const trans = shallowReactive({
    disabled: false,
    files: <any>[],
    fileList: <any>[],
    preview: false,
    index: 0
})

const emit = defineEmits([
    'update:modelValue'
])

const onExceed: UploadProps['onExceed'] = () => {
    toast(`最大数量不得超过${get(props.attr, 'limit', 0)}张`)
}


const onUpload = async (options: UploadRequestOptions) => {
    let uid = get(options.file, 'uid');
    apiPySystemUploadImage(options.file)
        .then(({ success, data, message }) => {
            if (!success) {
                toast(message);
                return;
            }
            let url = String(first(get(data, 'url', [])));
            let file = find(files.value, (item) => {
                return get(item, 'uid') === uid
            })
            set(file, 'url', url);
            emitFiles();
        })
}

const onPreview = (file: UploadFile) => {
    let url = get(file, 'url');
    let extension = urlExtension(String(file.url));
    if (!includes(pyFileExtensions.images, extension)) {
        window.open(url);
        return;
    }
    let fileList = <any>[];
    each(files.value, function (file) {
        if (includes(pyFileExtensions.images, urlExtension(get(file, 'url')))) {
            fileList.push(get(file, 'url'));
        }
    })
    trans.fileList = fileList;
    trans.index = indexOf(trans.fileList, url);
    trans.preview = true;
}

const onRemove = (file: object) => {
    let url = get(file, 'url');
    files.value = reject(files.value, { url })
    emitFiles();
}

const emitFiles = () => {
    let urls = [];
    if (files.value.length > 0) {
        urls = map(files.value, (item) => {
            return get(item, 'url')
        })
    }
    emit('update:modelValue', urls)
}


const init = () => {
    if (props.modelValue.length) {
        files.value = map(props.modelValue, (url) => {
            return { name: '', url }
        })
    }
}


onMounted(() => {
    init();
})
</script>
