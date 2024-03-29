<template>
    <div :class="{login:true,'dev--login':true, 'large': sizeGte(trans.media, 'md')}">
        <div class="login-side"></div>
        <div class="login-login">
            <div class="form login-form">
                <div class="form-desc">
                    <img :src="trans.logo" :alt="trans.title" v-if="trans.logo">
                    <h4>{{ trans.title }}开发平台登录</h4>
                </div>
                <ElForm :model="value" :rules="rules" ref="form" label-width="100px" label-position="top" size="large" @keyup.enter="onSubmit">
                    <ElFormItem label="通行证" prop="passport">
                        <ElInput v-model="value.passport"/>
                    </ElFormItem>
                    <ElFormItem label="密码" prop="password">
                        <ElInput v-model="value.password" type="password"/>
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton type="primary" class="py--block" @click="onSubmit" v-loading="store.getters['poppy/isLoading']()">
                            开发者登录
                        </ElButton>
                    </ElFormItem>
                </ElForm>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
import useUserUtil from '../../composables/useUserUtil';
import { toast } from "@/utils/util";
import { sizeGte } from "@popjs/core/utils/helper";
import { apiPySystemAuthLogin } from "@/services/poppy";

const store = useStore();
const trans = reactive({
    title: computed(() => get(store.state.poppy.core, 'py-system.title')),
    logo: computed(() => get(store.state.poppy.core, 'py-system.logo')),
    media: computed(() => store.state.poppy.media),
})
const form: any = ref<InstanceType<typeof ElForm>>();
const value = reactive({
    passport: '',
    password: ''
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
            }, 'develop').then(({ success, message, data }) => {
                toast(message, success)
                if (success) {
                    userLogin({
                        token: get(data, 'token'),
                        type: 'develop',
                    })
                }
            })
        }
    })

}
</script>

<style scoped lang="less">

.login {
    color: #fff;
    background: url('../../assets/app/bg-develop.svg');
    min-height: 100vh;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.login-side {
    background: transparent;
    width: 40vw;
    height: 100vh;
}

.login-login {
    width: 60vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
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
    color: #5699D2;
    background: rgba(86, 153, 210, 0.9);
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.20);
    border-radius: 5px;
    max-width: 35rem;
}
</style>
