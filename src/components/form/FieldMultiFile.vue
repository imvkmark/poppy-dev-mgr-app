<template>
    <ElImageViewer :url-list="trans.fileList" :initial-index="trans.index" v-if="trans.preview"
        @close="trans.preview=false"/>
    <div class="form-file-list">
        <ElUpload action="#" name="file" :http-request="onUpload" list-type="picture-card" class="form-file" multiple
            :accept="get(attr, 'accept', '*/*')"
            :limit="get(attr, 'limit', 0)"
            :show-file-list="false">
            <ElIcon>
                <Plus/>
            </ElIcon>
        </ElUpload>
        <ul class="el-upload-list el-upload-list--picture-card is-disabled">
            <li class="el-upload-list__item is-success" v-for="file in trans.files" :key="file">
                <div class="form-file-preview">
                    <img class="el-upload-list__item-thumbnail"
                        v-if="includes(pyFileExtensions.images, urlExtension(file.url))" :src="file.url" alt=""/>
                    <span class="el-upload-list__item-thumbnail"
                        v-else-if="includes(pyFileExtensions.audio, urlExtension(file.url))">
                        <ElIcon>
                            <Headset/>
                        </ElIcon>
                    </span>
                    <span class="el-upload-list__item-thumbnail"
                        v-else-if="includes(pyFileExtensions.video, urlExtension(file.url))">
                        <ElIcon>
                            <Film/>
                        </ElIcon>
                    </span>
                    <span class="el-upload-list__item-thumbnail"
                        v-else>
                        <ElIcon>
                            <Document/>
                        </ElIcon>
                    </span>
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="onPreview(file)">
                            <ElIcon>
                                <ZoomIn/>
                            </ElIcon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="onRemove(file)">
                            <ElIcon>
                                <Delete/>
                            </ElIcon>
                        </span>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, shallowReactive, watch } from 'vue';
import { apiPySystemUploadImage } from '@/services/api/poppy';
import { Delete, Document, Film, Headset, Plus, ZoomIn } from '@element-plus/icons-vue';
import { urlExtension } from '@popjs/core/utils/helper';
import { each, first, get, includes, indexOf, map, union } from 'lodash-es';
import { toast } from "@/services/utils/util";
import { pyFileExtensions } from "@/services/utils/conf";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const trans = shallowReactive({
    disabled: false,
    files: <any>[],
    fileList: <any>[],
    preview: false,
    index: 0
})


const onUpload = ({ file }) => {
    apiPySystemUploadImage(file).then((resp) => {
        const { data } = resp;
        toast(resp);
        if (data) {
            let url = first(get(data, 'url', []));
            if (url) {
                trans.files = union([{
                    url: String(url).toString()
                }], trans.files)
            }
        }
    })
}

const onPreview = (file) => {
    let url = get(file, 'url');
    let extension = urlExtension(get(file, 'url'));
    if (!includes(pyFileExtensions.images, extension)) {
        window.open(url);
        return;
    }
    let fileList = <any>[];
    each(trans.files, function (file) {
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
    let newFiles = <any>[];
    each(trans.files, function (file) {
        if (get(file, 'url') === url) {
            return;
        }
        newFiles.push(file);
    })
    trans.files = newFiles;
}


const emit = defineEmits([
    'update:modelValue'
])


watch(() => trans.files, () => {
    let urls = [];
    if (trans.files.length > 0) {
        urls = map(trans.files, (item) => {
            return get(item, 'url')
        })
    }
    emit('update:modelValue', urls)
})


const init = () => {
    if (props.modelValue.length) {
        trans.files = map(props.modelValue, (url) => {
            return {
                name: '',
                url
            }
        })
    }
}

watch(() => props.modelValue, () => {
    init();
})

onMounted(() => {
    init();
})
</script>
