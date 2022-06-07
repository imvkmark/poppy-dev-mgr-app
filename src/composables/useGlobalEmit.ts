import { onMounted, onUnmounted } from 'vue'
import { useStore } from '@/store';
import { get } from "lodash-es";
import { ElMessageBox } from "element-plus";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_ACTION, MGR_APP_ACTION_PAGE, MGR_APP_ACTION_PROCESS, MGR_APP_ACTION_REQUEST, MGR_APP_MOTION, MGR_APP_MOTION_GRID, USER_LOGOUT } from "@/bus";
import { toast } from "@/utils/util";
import { REQUEST_401, REQUEST_EXCEPTION, REQUEST_LOADED, REQUEST_LOADING } from "@popjs/core/utils/request";
import { useRouter } from "vue-router";
import useUserUtil from "@/composables/useUserUtil";
import useClipboard from "vue-clipboard3";

/**
 * 全局动作
 */
export default function useGlobalEmit() {
    const store = useStore();
    const router = useRouter();
    const { userToLogin } = useUserUtil();

    onMounted(() => {

        //region 捕捉请求
        emitter.on(REQUEST_LOADING, (options) => {
            store.dispatch('poppy/Loading', options).then()
        })
        emitter.on(REQUEST_LOADED, (options) => {
            store.dispatch('poppy/Loaded', options).then()
        })
        emitter.on(REQUEST_401, () => {
            const name = String(router.currentRoute.value.name);
            let type = 'backend';
            if (name.indexOf('dev') != -1) {
                type = 'develop';
            }
            userToLogin(type)
        })
        emitter.on(REQUEST_EXCEPTION, (exception) => {
            emitter.emit(MGR_APP_MOTION, {
                type: 'exception',
                action: 'dialog',
                addition: exception
            })
        })
        //endregion


        //region 用户操作
        emitter.on(USER_LOGOUT, (data: any) => {
            store.dispatch('poppy/Logout', data).then(() => {
                const { type } = data;
                userToLogin(type)
            })
        })
        //endregion


        const { toClipboard } = useClipboard()
        const copyToClipboard = async (value: string) => {
            await toClipboard(String(value));
            toast('已复制')
        }

        //region 项目的动作
        emitter.on(MGR_APP_ACTION, (data) => {
            if (!get(data, 'method')) {
                return;
            }
            const confirm = get(data, 'confirm', false)
            const defConfirmText = get(data, 'confirm-text', '')
            const title = get(data, 'title');
            const doAction = (item: any) => {
                switch (item.method) {
                    // 页面请求
                    case 'request':
                        emitter.emit(MGR_APP_ACTION_REQUEST, item);
                        break;
                    // 页面
                    case 'page':
                        emitter.emit(MGR_APP_ACTION_PAGE, item);
                        break;
                    case 'copy':
                        copyToClipboard(get(item, 'content')).then();
                        break;
                    case 'progress':
                        emitter.emit(MGR_APP_ACTION_PROCESS, item);
                        break;
                    default:
                        toast('不正确的操作类型');
                        break;
                }
            }
            if (!confirm) {
                doAction(data);
                return;
            }
            const confirmText = defConfirmText ? defConfirmText : `确认要进行${title}操作?`;
            ElMessageBox.confirm(confirmText, '确认', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                doAction(data)
            })
        })

        emitter.on(MGR_APP_MOTION, (data) => {
            let type = get(data, 'type');
            let action = get(data, 'action')
            let addition = get(data, 'addition', {})
            if (!type) {
                return;
            }
            switch (type) {
                case 'exception':
                    const status = get(addition, 'status');
                    const message = get(addition, 'message');
                    // 如果异常有相应的 action , 可以预埋
                    if (status === 1) {
                        // 默认警告
                        ElMessageBox.alert(message, '警告', {
                            type: 'warning'
                        }).then()
                        return;
                    }

                    // 错误异常
                    ElMessageBox.alert(message, `错误:${status}`, {
                        type: 'error'
                    }).then()
                    break;
                case 'grid':
                    emitter.emit(MGR_APP_MOTION_GRID, action)
                    break;
                case 'window':
                    if (action === 'reload') {
                        window.location.reload();
                    }
                    break;
            }
        })
        //endregion
    })

    onUnmounted(() => {
        // 请求
        emitter.off(REQUEST_LOADING)
        emitter.off(REQUEST_LOADED)
        emitter.off(REQUEST_EXCEPTION)
        emitter.off(REQUEST_401)

        // 用户
        emitter.off(USER_LOGOUT)

        // 全局动作
        emitter.off(MGR_APP_MOTION);
        emitter.off(MGR_APP_ACTION);
    })
}
