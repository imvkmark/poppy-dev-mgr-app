<template>
    <PxMain title="Base64 转解码">
        <div class="main-handle">
            <ElSwitch v-model="trans.type" active-text="解码" inactive-text="转码" @change="onInput"/>
        </div>
        <div class="main-content">
            <ElRow :gutter="20">
                <ElCol :lg="{span:12}" :md="{span:12}" :sm="{span:24}">
                    <ElForm :model="value" :rules="rules" ref="form">
                        <ElFormItem prop="text">
                            <ElInput @input="onInput" @change="onInput" v-model="value.text"
                                :rows="8" type="textarea" placeholder="输入内容"/>
                        </ElFormItem>
                    </ElForm>
                </ElCol>
                <ElCol :lg="{span:12}" :md="{span:12}" :sm="{span:24}">
                    <ElTooltip content="点击复制">
                        <ElInput readonly v-model="trans.result" v-loading="store.getters['poppy/isLoading']()" class="main-pointer"
                            :autosize="{ minRows: 8, maxRows: 16 }" @click="onCopy"
                            :rows="8" type="textarea" placeholder="转换后内容"/>
                    </ElTooltip>
                </ElCol>
            </ElRow>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
import { copyText } from 'vue3-clipboard'
import { debounce, get } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { localStore, toast } from "@/framework/utils/util";

const store = useStore();
const router = useRouter();
const trans = reactive({
    type: false,
    result: '',
    key: 'tool-base64'
})
const value = reactive({
    text: 'wulicode.com'
})
const form: any = ref<InstanceType<typeof ElForm>>();

const rules = reactive({
    text: [
        { required: true, message: '输入需要转换的内容', trigger: 'change' }
    ]
})

const onInput = debounce(function () {
    // 解码
    if (trans.type === true) {
        if (value.text === 'wulicode.com') {
            value.text = 'd3VsaWNvZGUuY29t'
        }
    } else {
        if (value.text === 'd3VsaWNvZGUuY29t') {
            value.text = 'wulicode.com'
        }
    }
    if (!value.text) {
        trans.result = '';
    }
    if (trans.type) {
        // decode
        try {
            trans.result = window.atob(value.text);
        } catch (e) {
            trans.result = '';
            toast(e);
        }

    } else {
        // encode
        trans.result = window.btoa(value.text);
    }

    // 这里保存原始输入
    localStore(trans.key, {
        type: trans.type,
        text: value.text
    })
}, 100, {
    leading: false,
    trailing: true
})


const onCopy = function () {
    copyText(trans.result, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error, false)
        } else {
            toast('已复制')
        }
    })
}

onMounted(onInput);
onMounted(() => {
    // recovery
    let content = localStore(trans.key);
    if (content) {
        value.text = get(content, 'text');
        trans.type = get(content, 'type');
    }
})

</script>

<style scoped lang="less">
</style>
