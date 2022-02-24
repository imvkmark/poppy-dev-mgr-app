import { get } from 'lodash-es';
import { PyRequestOptions } from "@/framework/utils/types";
import http from '@/utils/http';
import { emitter, PY_CORE_EXCEPTION, PY_CORE_LOADED, PY_CORE_LOADING, PY_USER_LOGOUT } from "@/framework/bus/mitt";

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
            let exception = {
                success: false,
                options,
                status: 0,
                data: {},
                resp: {
                    status: 0,
                    message: '',
                },
                message: '',
            }
            let msg;
            if (response && response instanceof Object) {
                const { data, statusText, status: code } = response;
                msg = data.message || statusText;
                exception.status = code
                exception.resp.status = code
                if (code === 401) {
                    msg = '无权访问, 请登录后重试';
                    exception.message = msg;
                    exception.resp.message = msg;
                    emitter.emit(PY_USER_LOGOUT, exception);
                    return Promise.reject(exception);
                }

                if (code === 500) {
                    msg = '错误码 = ' + code + '，请联系管理人员或者是客服人员！';
                } else {
                    msg = `错误码 = ${code}, 访问地址 ${options.url} 不存在`;
                }
                exception.message = msg;
                exception.status = code;
                exception.resp.status = code;
                exception.resp.message = msg;
                console.error(options.url, code, msg, response, error.toJSON());
                emitter.emit(PY_CORE_EXCEPTION, exception);
                return Promise.reject(exception);
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
                exception.message = msg;
                exception.status = 520;
                exception.resp.status = 520;
                exception.resp.message = msg;
                console.error(options.url, 520, msg, error.toJSON());
                emitter.emit(PY_CORE_EXCEPTION, exception);
                return Promise.reject(exception);
            }
        });
}

