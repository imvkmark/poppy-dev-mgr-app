import { Module } from 'vuex'
import { get } from 'lodash-es';
import { deviceId, localStore, sessionStore } from '@/framework/utils/helper';
import { apiPySystemAuthAccess, apiPySystemCoreInfo } from '@/framework/services/poppy';
import { emitter, PY_USER_LOGIN } from '@/framework/bus/mitt'
import { PyPoppyRequest, PyPoppyTypes, PyRootStateTypes } from "@/framework/store/types";
import { pyStorageKey } from "@/framework/utils/conf";

// Create a new store Modules.
const poppy: Module<PyPoppyTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        core: {},
        user: {},

        // theme
        size: '',

        // request
        loading: false,

        request: {},
        requestBtnKey: '',
        action: '',

        // 全局警告
        message: {},
        elementSize: 'default'
    },
    mutations: {
        SET_SIZE(state: PyPoppyTypes, { size }) {
            state.size = size
        },
        SET_ELEMENT_SIZE(state: PyPoppyTypes, size) {
            let theme = {
                'elementSize': size
            }
            localStore(pyStorageKey.theme, theme)
            state.elementSize = size
        },
        SET_ACTION(state: PyPoppyTypes, action) {
            state.action = action
        },
        SET_APP_ID(state: PyPoppyTypes, deviceId) {
            state.appId = deviceId
        },
        SET_TOKEN(state: PyPoppyTypes, obj) {
            state.token = get(obj, 'token')
        },
        SET_CORE(state: PyPoppyTypes, obj) {
            state.core = obj
        },
        SET_USER(state: PyPoppyTypes, obj) {
            state.user = obj
        },
        SET_MESSAGE(state: PyPoppyTypes, obj) {
            state.message = obj
        },
        SET_REQUEST(state: PyPoppyTypes, obj: PyPoppyRequest) {
            state.request = obj
        },
        SET_BTN_KEY(state: PyPoppyTypes, str) {
            state.requestBtnKey = str
        },
    },
    actions: {
        /**
         * 系统初始化
         * @constructor
         */
        Init({ commit }) {
            // 设备ID
            commit('SET_APP_ID', deviceId())

            // 系统信息
            let info: any = sessionStore(pyStorageKey.core);
            if (info) {
                commit('SET_CORE', info)
            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (success) {
                        sessionStore(pyStorageKey.core, data);
                        commit('SET_CORE', info)
                    }
                })
            }
        },

        /**
         * 获取用户信息
         * @param commit
         * @constructor
         */
        Fetch({ commit }) {
            apiPySystemAuthAccess({}).then(({ success, data }) => {
                if (success) {
                    commit('SET_USER', data);
                }
            })
        },

        /**
         * 登录, 有 token 则认定为登录
         * @constructor
         */
        Login({ commit, state, dispatch }, { token }) {
            // 保存用户的Token
            localStore(pyStorageKey.token, token);
            // token 变化在监听中触发获取信息
            commit('SET_TOKEN', { token });
            // 另一种方式触发事件
            emitter.emit(PY_USER_LOGIN, { token })
        },

        /**
         * 退出登录
         */
        Logout({ commit }) {
            localStore(pyStorageKey.token, null);
            commit('SET_TOKEN', { token: '' })
            commit('SET_USER', {});
        },

        /**
         * 加载中
         */
        Loading({ state }) {
            state.loading = true
        },

        /**
         * 加载完毕
         */
        Loaded({ state }) {
            state.loading = false
        },

        /**
         * 设定组件规格大小
         */
        SetSize({ commit }, size) {
            // 设备ID
            commit('SET_SIZE', size)
        },
    }
}

export default poppy
