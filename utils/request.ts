import { get } from 'lodash-es';
import { PyRequestOptions } from "@/framework/utils/types";
import http from '@/utils/http';
import { emitter, PY_CORE_LOADED, PY_CORE_LOADING, PY_USER_LOGOUT } from "@/framework/bus/mitt";

export default function request(options: PyRequestOptions) {
    emitter.emit(PY_CORE_LOADING);
    // @ts-ignore
    return http(options)
        .then((response: any) => {
            emitter.emit(PY_CORE_LOADED);
            const { data = {}, status, message } = response.data;
            console.info(options.url, status, message, response.data);
            if (status === 0) {
                /* 请求成功且 状态码为 0
                 * ---------------------------------------- */
                return Promise.resolve({
                    success: true,
                    message: message,
                    status: status,
                    data: data,
                    resp: {
                        status,
                        message
                    }
                });
            } else {
                return Promise.resolve({
                    success: false,
                    status: status,
                    message: message,
                    data: data,
                    resp: {
                        status,
                        message
                    }
                });
            }
        })
        .catch((error: any) => {
            emitter.emit(PY_CORE_LOADED);
            const { response } = error;
            let msg;
            if (response && response instanceof Object) {
                const { data, statusText, status: code } = response;
                msg = data.message || statusText;
                if (code === 401) {
                    emitter.emit(PY_USER_LOGOUT)

                    return Promise.reject({
                        success: false,
                        status: code,
                        message: '无权访问, 请登录后重试',
                        data: {},
                        resp: {
                            status: code,
                            message: '无权访问, 请登录后重试'
                        }
                    });
                }

                if (code === 500) {
                    msg = '错误码 = ' + code + '，请联系管理人员或者是客服人员！';
                } else {
                    msg = `错误码 = ${code}, 访问地址 ${options.url} 不存在`;
                }
                console.error(options.url, code, msg, response, error.toJSON());
                return Promise.reject({
                    success: false,
                    status: code,
                    message: msg,
                    data: {},
                    resp: {
                        status: code,
                        message: msg
                    }
                });
            } else {
                msg = error.message || '未知错误(一般是访问超时)';
                if (error.name === 'Error') {
                    if (error.code === 'ECONNABORTED') {
                        if (get(error, 'config.data') instanceof FormData) {
                            msg = '上传超时，请检查网络或压缩图片上传';
                        } else {
                            msg = '请求超时，请检查网络或重试';
                        }
                    }
                    if (error.message === 'Network Error') {
                        msg = '网络连接异常！';
                    }
                }

                console.error(options.url, 520, msg, error.toJSON());
                return Promise.reject({
                    success: false,
                    status: 520,
                    message: msg,
                    data: {},
                    resp: {
                        status: 520,
                        message: msg
                    }
                });
            }
        });
}

