import { Module } from 'vuex'
import { get, set } from 'lodash-es';
import { base64Encode, deviceId } from "@popjs/core/utils/helper";
import { apiPySystemCoreInfo } from '@/services/poppy';
import { emitter } from "@popjs/core/bus/mitt";
import { apiMgrAppHomeClearCache, apiMgrAppUserInfo } from "@/services/mgr-app";
import { appLocalStore, appSessionStore, toast } from "@/services/utils/util";
import { PyPoppyTypes, PyRootStateTypes } from "@/services/store/types";
import { pyStorageKey, storageCoreKey, storageTokenKey, USER_LOGIN } from "@/services/utils/conf";

const poppy: Module<PyPoppyTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        backendToken: '',
        developToken: '',
        core: {},
        user: {},

        // theme
        media: '',         // 媒体响应尺寸
        size: 'default',
        style: 'light',

        // request
        loading: {},

        motion: {
            type: '',
            action: '',
            addition: {},
        },
        action: {},

        // 标题
        title: '',

        menus: [],

        grid: '',
    },
    getters: {
        isLoading: (state) => (url: string = '') => {
            if (url === '') {
                // 全局的加载, 只要是有请求, 便是触发全局Loading
                return get(state.loading, 'global', false)
            }
            // 获取当前 Url 的加载
            return get(state.loading, base64Encode(url), false)
        }
    },
    actions: {
        /**
         * 系统初始化
         * @constructor
         */
        Init({ state }) {
            // 设备ID
            state.appId = deviceId();

            // 系统信息
            let info: any = appSessionStore(storageCoreKey());
            if (info) {
                state.core = info;
            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (!success) {
                        return;
                    }
                    appSessionStore(storageCoreKey(), data);
                    state.core = data;
                })
            }
        },

        /**
         * 获取用户信息
         * @param commit
         * @param state
         * @constructor
         */
        Fetch({ commit, state }) {
            apiMgrAppUserInfo().then(({ success, data }) => {
                if (!success) {
                    return;
                }
                state.user = get(data, 'user', {});
                state.menus = get(data, 'menus', []);
            })
        },

        /**
         * 登录, 有 token 则认定为登录
         * @constructor
         */
        Login({ commit, state, dispatch }, { token, type }) {
            // 保存用户的Token
            appLocalStore(storageTokenKey(type), token);
            // token 变化在监听中触发获取信息
            if (type === 'backend') {
                state.backendToken = token;
            } else if (type === 'develop') {
                state.developToken = token;
            }
            // 另一种方式触发事件
            emitter.emit(USER_LOGIN, { token, type });
        },

        /**
         * 退出登录
         */
        Logout({ commit, state }, { type }) {
            appLocalStore(storageTokenKey(type), null);
            if (type === 'backend') {
                state.backendToken = '';
                state.user = {};
                state.menus = [];
            } else if (type === 'develop') {
                state.developToken = '';
            }
        },

        /**
         * 加载中
         */
        Loading({ state }, { url }) {
            set(state.loading, 'global', true);
            set(state.loading, base64Encode(url), true)
        },

        /**
         * 加载完毕
         */
        Loaded({ state }, { url }) {
            set(state.loading, 'global', false);
            set(state.loading, base64Encode(url), false)
        },

        /**
         * 设定组件规格大小
         */
        SetSize({ state }, size) {
            let theme: any = appLocalStore(pyStorageKey.theme) ? appLocalStore(pyStorageKey.theme) : {};
            set(theme, 'size', size);
            appLocalStore(pyStorageKey.theme, theme)
            state.size = size;
        },

        /**
         * 设置页面主题风格
         */
        SetStyle({ state }, val) {
            let theme: any = appLocalStore(pyStorageKey.theme) ? appLocalStore(pyStorageKey.theme) : {};
            set(theme, 'style', val);
            appLocalStore(pyStorageKey.theme, theme);
            document.documentElement.setAttribute('theme', val);
            state.style = val;
        },

        /**
         * 设置 Media 尺寸
         */
        SetMedia({ commit, state }, media) {
            state.media = media;
        },

        /**
         * 设置页面的标题
         */
        SetTitle({ commit, state }, title) {
            document.title = `${title} - ${get(state.core, 'py-system.title')}`
            state.title = title;
        },

        /**
         * 设置页面的标题
         */
        ClearCache({ dispatch }) {
            appLocalStore(pyStorageKey.navs, null);
            appSessionStore(storageCoreKey(), null);
            apiMgrAppHomeClearCache().then(() => {
                toast('已清空缓存, 稍后会进行页面刷新');
                setTimeout(() => {
                    dispatch('SetMotion', {
                        type: 'window',
                        action: 'reload',
                    })
                }, 1000);
            })
        },

        /**
         * 设置全局动作
         */
        SetMotion({ state }, motion) {
            const { type, action } = motion;
            const addition = get(motion, 'addition', {});
            state.motion = { type, action, addition }
        },
        /**
         * 清除全局的动作
         */
        ClearMotion({ state }) {
            state.motion = { type: '', action: '', addition: {} }
        },

        SetAction({ state }, action) {
            state.action = action;
        },
        ClearAction({ state }) {
            state.action = {};
        },

        /**
         * 列表的操作
         */
        SetGrid({ state }, grid) {
            state.grid = grid;
        },

        /**
         * 清空列表
         */
        ClearGrid({ state }) {
            state.grid = '';
        },
    }
}

export default poppy
