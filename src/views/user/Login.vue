<template>
    <div class="login py--main">
        <ElRow justify="center">
            <ElCol :span="12" :xs="{span:22}" :sm="{span:18}">
                <div class="login-ctr">
                    <div class="form">
                        <div class="form-desc">
                            <h4>{{ trans.title }}登录</h4>
                            <p>开发中的前后端分离框架</p>
                        </div>
                        <ElForm :model="value" :rules="rules" ref="form" label-width="100px" label-position="top">
                            <ElFormItem label="通行证" prop="passport">
                                <ElInput v-model="value.passport"/>
                            </ElFormItem>
                            <ElFormItem label="密码" prop="password">
                                <ElInput v-model="value.password"/>
                            </ElFormItem>
                            <ElFormItem>
                                <ElButton type="primary" class="py--block" @click="onSubmit()">
                                    登录
                                </ElButton>
                            </ElFormItem>
                        </ElForm>
                    </div>
                </div>
            </ElCol>
        </ElRow>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { apiPySystemAuthLogin } from '@/framework/services/poppy';
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
import useUserUtil from '@/composables/useUserUtil';
import { toast } from "@/framework/utils/util";

const store = useStore();
const trans = reactive({
    title: computed(() => get(store.state.poppy.core, 'py-system.title'))
})
const form: any = ref<InstanceType<typeof ElForm>>();
const value = reactive({
    passport: '',
    password: '',
    captcha: ''
})
const rules = reactive({
    passport: [
        { required: true, message: '请输入通行证', trigger: 'change' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'change' }
    ]
})
const router = useRouter();

const { userLogin } = useUserUtil();

const onSubmit = () => {
    form.value.validate((valid: boolean) => {
        if (valid) {
            apiPySystemAuthLogin({
                passport: value.passport,
                password: value.password,
                guard: 'backend'
            }).then(({ success, data, resp }) => {
                toast(resp)
                if (success) {
                    userLogin({
                        token: get(data, 'token')
                    })
                }
            })
        }
    })

}
</script>

<style scoped lang="less">

.login {
    background: #081836;
}

.login-ctr {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.form-desc {
    display: flex;
    flex-direction: column;
    align-items: center;
    h4 {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: var(--wc-color-text);
        text-align: center;
        margin: 0;
    }
    p {
        font-size: 12px;
        color: var(--wc-text-color);
        text-align: center;
        margin-top: 0;
    }
}

.form {
    width: 100%;
    background: #FFF;
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.20);
    border-radius: 5px;
    max-width: 40rem;
}
</style>
