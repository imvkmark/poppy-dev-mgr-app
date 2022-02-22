<template>
    <ElUpload action="#" name="file" :http-request="onUpload" list-type="picture-card" class="form-file"
        :file-list="trans.files" v-if="trans.files.length<=0" :accept="get(attr, 'accept', '*/*')"
        :show-file-list="false">
        <ElIcon>
            <Plus/>
        </ElIcon>
    </ElUpload>
    <ElImageViewer :url-list="fileList" v-if="trans.preview" @close="onClosePreview"/>
    <div class="form-file-list">
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
                        <span class="el-upload-list__item-preview" @click="onPreview()">
                            <ElIcon>
                                <ZoomIn/>
                            </ElIcon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="onRemove()">
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
import { computed, onMounted, reactive, watch } from 'vue';
import { apiPySystemUploadFile } from '@/framework/services/poppy';
import { Delete, Document, Film, Headset, Plus, ZoomIn } from '@element-plus/icons';
import { toast } from '@/framework/utils/helper';
import { first, get, includes, map } from 'lodash-es';
import { urlExtension } from '@/framework/utils/helper';
import { pyFileExtensions } from "@/framework/utils/conf";

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

const onUpload = ({ file }) => {
    apiPySystemUploadFile(file, get(props.attr, 'type', 'file')).then((resp) => {
        const { data } = resp;
        toast(resp)
        if (get(data, 'url', []).length) {
            trans.files = [{
                url: String(first(get(data, 'url', []))).toString()
            }]
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
    'change'
])

watch(() => trans.files, () => {
    let url = '';
    if (trans.files.length > 0) {
        url = get(first(trans.files), 'url');
    }
    emit('change', {
        name: props.name,
        value: url
    })
})

onMounted(() => {
    if (props.defaultValue) {
        trans.files = [{ url: props.defaultValue, name: '' }]
    }
})
</script>
