<template>
    <PxMain title="ApiDoc注释生成">
        <div class="main-content main-mono">
            <ElRow :gutter="20">
                <ElCol :span="12">
                    <ElForm :model="value" :rules="rules" ref="form">
                        <ElFormItem prop="text">
                            <ElInput @input="onInput" v-model="value.text"
                                :rows="8" type="textarea" placeholder="输入Json 内容"/>
                        </ElFormItem>
                    </ElForm>
                </ElCol>
                <ElCol :span="12">
                    <ElTooltip content="点击复制">
                        <ElInput readonly v-model="trans.comment" v-loading="store.getters['poppy/isLoading']()" class="main-pointer"
                            :autosize="{ minRows: 8, maxRows: 16 }" @click="onCopy"
                            :rows="8" type="textarea" placeholder="输出注释"/>
                    </ElTooltip>
                </ElCol>
            </ElRow>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store';
import { debounce, get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { apiOpToolApidoc } from '@/services/op';
import { ElForm } from 'element-plus';
import { copyText } from 'vue3-clipboard'
import PxMain from '@/framework/components/base/PxMain.vue';
import { toast } from "@/framework/utils/util";

const store = useStore();
const router = useRouter();
const trans = reactive({
    comment: ''
})
const value = reactive({
    text: '{}'
})
const form: any = ref<InstanceType<typeof ElForm>>();


const rules = reactive({
    text: [
        { required: true, message: '输入需要转换的Json', trigger: 'change' },
        {
            validator: (rule: any, val: string, callback: any) => {
                try {
                    if (typeof JSON.parse(val) !== 'object') {
                        callback('请输入正确的Json 数据');
                    }
                } catch (e) {
                    callback('请输入正确的Json 数据');
                }
                return true;
            },
            trigger: 'blur'
        }
    ]
})

const onInput = debounce(function () {
    if (!value.text) {
        trans.comment = '';
    }
    form.value.validate((valid: boolean) => {
        if (valid) {
            store.dispatch('Loading')
            apiOpToolApidoc({
                content: value.text
            }).then(({ data, success, message, resp }) => {
                if (success) {
                    trans.comment = get(data, 'comment');
                } else {
                    toast(message, false)
                }
            })
        }
    })
}, 300, {
    leading: false,
    trailing: true
})


const onCopy = function () {
    copyText(trans.comment, undefined, (error: any) => {
        if (error) {
            toast('无法复制:' + error, false)
        } else {
            toast('已复制')
        }
    })
}

onMounted(onInput);
</script>

<style scoped lang="less">
</style>
