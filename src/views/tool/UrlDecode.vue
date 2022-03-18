<template>
    <PxMain title="Url解码">
        <div class="main-content">
            <ElRow :gutter="20">
                <ElCol :span="12">
                    <ElForm :model="value" :rules="rules" ref="form">
                        <ElFormItem prop="text">
                            <ElInput @input="onInput" @change="onInput" v-model="value.text" :rows="8" type="textarea" placeholder="输入内容"/>
                        </ElFormItem>
                    </ElForm>
                </ElCol>
                <ElCol :span="12">
                    <ElTooltip content="点击复制">
                        <ElInput readonly v-model="trans.result" v-loading="store.getters['poppy/isLoading']()" class="main-pointer"
                            :autosize="{ minRows: 8, maxRows: 16 }" @click="onCopy"
                            :rows="8" type="textarea" placeholder="转换后内容"/>
                    </ElTooltip>
                    <ElAlert v-if="trans.error" show-icon type="error" :closable="false">{{ trans.error }}</ElAlert>
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
import { debounce, each, get } from 'lodash-es';
import qs from 'qs';
import PxMain from '@/framework/components/base/PxMain.vue';
import { localStore, toast } from "@/framework/utils/util";


const store = useStore();
const router = useRouter();
const trans = reactive({
    ori: 'wulicode.com?role=duoli&wechat=imvkmark',
    result: '',
    error: '',
    key: 'tool-url'
})
const value = reactive({
    text: ''
})
const form: any = ref<InstanceType<typeof ElForm>>();

const rules = reactive({
    text: [
        { required: true, message: '输入需要转换的内容', trigger: 'change' }
    ]
})

const onInput = debounce(function () {
    if (!value.text) {
        trans.result = '';
    }
    const hasQuestion = value.text.indexOf('?') > -1;
    let content;
    if (hasQuestion) {
        content = value.text.substr(value.text.indexOf('?') + 1)
    } else {
        const hasEqual = value.text.indexOf('=') > -1;
        if (hasEqual) {
            content = value.text;
        } else {
            trans.error = '没有匹配到需要转换的数据'
        }
    }
    if (content) {
        let parsedObj = qs.parse(content);
        let parsed = '';
        each(parsedObj, function (item, key) {
            parsed += `${key} : ${item} \n`;
        })
        trans.result = parsed;
        // 这里保存原始输入
        localStore(trans.key, {
            text: value.text
        })
    }


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
    }
})

</script>

<style scoped lang="less">

.error {
    margin-top: 10px;
}
</style>
