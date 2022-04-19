<template>
    <div class="wrapper">
        <Toolbar :editor="editorRef" style="border-bottom: 1px solid #ccc" :default-config="toolConfig" mode="simple"/>
        <Editor :model-value="modelValue" @onChange="onUpdateContent" :default-config="editorConfig" mode="simple"
            @onCreated="handleCreated"
            style="height: 500px; overflow-y: hidden;"/>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, shallowRef } from 'vue';
import { apiPySystemUploadImage } from "@/services/api/poppy";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css';
import { toast } from "@/services/utils/util";

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

const editorRef = shallowRef();

const onUpdateContent = () => {
    emit('update:modelValue', editorRef.value.getHtml());
}
const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
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
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
</script>
<style lang="less">
.wrapper {
    width: 100%;
    border: 1px solid #ccc;
    line-height: 1.5;
}
</style>
