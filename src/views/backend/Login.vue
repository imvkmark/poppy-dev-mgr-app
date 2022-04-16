<template>
    <div class="login py--login">
        <div class="form login-form">
            <div class="form-desc">
                <img :src="trans.logo" :alt="trans.title" v-if="trans.logo">
                <h4>{{ trans.title }}后台登录</h4>
            </div>
            <ElForm :model="value" :rules="rules" ref="form" label-width="100px" label-position="top" size="large" @keyup.enter="onSubmit">
                <ElFormItem label="通行证" prop="passport">
                    <ElInput v-model="value.passport"/>
                </ElFormItem>
                <ElFormItem label="密码" prop="password">
                    <ElInput v-model="value.password" type="password"/>
                </ElFormItem>
                <ElFormItem>
                    <ElButton type="primary" class="py--block" @click="onSubmit()" v-loading="store.getters['poppy/isLoading']()">
                        登录
                    </ElButton>
                </ElFormItem>
            </ElForm>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from '@/services/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
import useUserUtil from '@/services/composables/useUserUtil';
import { toast } from "@/services/utils/util";
import { apiPySystemAuthLogin } from "@/services/poppy";

const store = useStore();
const trans = reactive({
    title: computed(() => get(store.state.poppy.core, 'py-system.title')),
    logo: computed(() => get(store.state.poppy.core, 'py-system.logo')),
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
            }, 'backend').then(({ success, data, message }) => {
                toast(message, success)
                if (success) {
                    userLogin({
                        token: get(data, 'token'),
                        type: 'backend'
                    })
                }
            })
        }
    })
}
</script>

<style scoped lang="less">

.login {
    background: url('../../assets/app/bg-backend.svg');
    background-size: cover;
    color: #fff;
    min-height: 100vh;
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
    img {
        max-height: 60px;
    }
    h4 {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
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
    background: rgba(54, 57, 63, 0.95);
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.20);
    border-radius: 5px;
    max-width: 35rem;
}
</style>
