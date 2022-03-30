<template>
    <div class="wrapper">
        <Toolbar :editor-id="editorId" style="border-bottom: 1px solid #ccc" :default-config="toolConfig"/>
        <Editor :editor-id="editorId" @onChange="onUpdateContent" :default-config="editorConfig" :default-html="modelValue"
            style="min-height: 300px; overflow-y: hidden;"
        />
    </div>
</template>
<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { apiPySystemUploadImage } from "@/services/poppy";
import { Editor, getEditor, removeEditor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css';
import { toast } from "@/framework/utils/util";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})
const emit = defineEmits([
    'update:modelValue'
])
const editorId = 'mgr-app-editor'
const onUpdateContent = () => {
    const editor = getEditor(editorId);
    emit('update:modelValue', editor?.getHtml());
}

const toolConfig = {
    excludeKeys: [
        'headerSelect',
        'emotion',
        'uploadVideo',
        'group-more-style'
    ]
}


const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        // 配置上传图片
        uploadImage: {
            customUpload: async (file: File, insertFn: any) => {
                apiPySystemUploadImage(file).then(({ data }) => {
                    insertFn(data.url[0])
                }).catch(({ message }) => {
                    toast(message)
                })
            }
        },
    }
};

// 及时销毁编辑器
onUnmounted(() => {
    const editor = getEditor(editorId);
    if (editor == null) return;
    editor.destroy();
    removeEditor(editorId);
});
</script>
<style lang="less">
.wrapper {
    width: 100%;
    border: 1px solid #ccc;
    line-height: 1.5;
}
</style>
