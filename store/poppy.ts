import { Module } from 'vuex'
import { get } from 'lodash-es';
import { localStore, sessionStore, toast } from '@/framework/utils/helper';
import { apiPySystemAuthAccess, apiPySystemCoreInfo } from '@/framework/services/poppy';
import { emitter, PY_USER_LOGIN } from '@/framework/bus/mitt'
import { PyPoppyTypes, PyRootStateTypes } from "@/framework/store/types";
import { deviceId } from "@/framework/utils/helper";
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
        size: ''
    },
    mutations: {
        SET_SIZE(state: PyPoppyTypes, size) {
            state.size = size
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
        }
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
            let info: any = sessionStore(pyStorageKey.PY_CORE_INFO);
            if (info) {
                commit('SET_CORE', info)
            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (success) {
                        sessionStore(pyStorageKey.PY_CORE_INFO, data);
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
            localStore(pyStorageKey.PY_TOKEN, token);
            // token 变化在监听中触发获取信息
            commit('SET_TOKEN', { token });
            // 另一种方式触发事件
            emitter.emit(PY_USER_LOGIN, { token })
        },

        /**
         * 退出登录
         * @constructor
         */
        Logout({ state, commit }, options) {
            let from = get(options, 'from');
            if (from === 'api') {
                toast('用户访问受限, 请重新登录', false);
            }
            localStore(pyStorageKey.PY_TOKEN, null);
            commit('SET_TOKEN', { token: '' })
            commit('SET_USER', {})
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
