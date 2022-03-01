import { Module } from 'vuex'
import { get } from 'lodash-es';
import { deviceId, localStore, sessionStore, toast } from '@/framework/utils/helper';
import { apiPySystemAuthAccess, apiPySystemCoreInfo } from '@/framework/services/poppy';
import { emitter, PY_USER_LOGIN } from '@/framework/bus/mitt'
import { PyPoppyRequest, PyPoppyTypes, PyRootStateTypes } from "@/framework/store/types";
import { pyStorageKey } from "@/framework/utils/conf";
import { apiMgrAppHomeClearCache } from "@/framework/services/mgr-app";

const poppy: Module<PyPoppyTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        core: {},
        user: {},

        // theme
        media: '',         // 媒体响应尺寸
        size: 'default',

        // request
        loading: false,

        request: {},
        requestBtnKey: '',
        action: '',


        // 全局警告
        message: {},


        // 标题
        title: '',
    },
    mutations: {
        SET_MEDIA(state: PyPoppyTypes, media) {
            state.media = media
        },
        SET_SIZE(state: PyPoppyTypes, { size }) {
            state.size = size
        },
        SET_TITLE(state: PyPoppyTypes, title) {
            state.title = title
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
            let theme = {
                'size': size
            }
            localStore(pyStorageKey.theme, theme)
            commit('SET_SIZE', size)
        },

        /**
         * 设置 Media 尺寸
         */
        SetMedia({ commit }, media) {
            commit('SET_MEDIA', media)
        },

        /**
         * 设置页面的标题
         */
        SetTitle({ commit, state }, title) {
            document.title = `${title} - ${get(state.core, 'py-system.title')}`
            commit('SET_TITLE', title)
        },

        /**
         * 设置页面的标题
         */
        ClearCache({ commit }) {
            localStore(pyStorageKey.navs, null);
            apiMgrAppHomeClearCache().then(() => {
                toast('已清空缓存, 稍后会进行页面刷新');
                setTimeout(() => {
                    commit('SET_ACTION', 'reload')
                }, 1000);
            })
        },


    }
}

export default poppy
