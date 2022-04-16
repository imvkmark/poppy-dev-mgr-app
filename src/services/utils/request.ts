import { each, get, isNil, isObject, keys, merge, set, trim } from 'lodash-es';
import { emitter, REQUEST_401, REQUEST_EXCEPTION } from "@popjs/core/bus/mitt";
import { appLocalStore } from "@/services/utils/util";
import { pyRequest } from "@popjs/core/utils/request";
import { AxiosRequestConfig } from "axios";
import { appUrl, appVersion, storageTokenKey } from "@/services/utils/conf";
import { MD5 } from "crypto-js";

let url = appUrl;
if (!url) {
    url = `${window.location.protocol}//${window.location.host}`
}

pyRequest.interceptors.request.use(
    (config: any) => {
        config.baseURL = url;

        // app - base
        config.headers['x-os'] = 'webapp';
        config.headers['x-ver'] = appVersion;

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    }
);

/**
 * 加密串生成
 * @param {object} params 请求接口时的参数
 * @param {string} token token字段
 * @returns {string}
 * @private
 */
const appSign = (params: any, token = '') => {
    let debug = false;
    let kvStr = '';
    let arrKeys = keys(params);
    arrKeys.sort();
    each(arrKeys, function (key) {
        if (key !== 'image' && key !== 'file') {
            if (isObject(params[key])) {
                kvStr += key + '=' + JSON.stringify(params[key]) + ','
            } else {
                kvStr += key + '=' + params[key] + ','
            }
        }
    });
    kvStr = kvStr.slice(0, -1);
    let v1Md5 = MD5(MD5(kvStr).toString() + token).toString();
    if (debug) {
        console.warn(kvStr, MD5(kvStr).toString(), v1Md5);
    }
    return v1Md5.charAt(1) + v1Md5.charAt(3) + v1Md5.charAt(15) + v1Md5.charAt(31)
};


let appParams = (data: any = null, type: string = 'backend') => {
    let oriData = data || {};

    let params: any;
    if (oriData instanceof FormData) {
        params = new FormData();
        for (let pair of oriData.entries()) {
            if (isNil(pair[1])) {
                return;
            }
            let sv = pair[1];
            if (typeof pair[1] === 'string') {
                sv = trim(pair[1]);
            }
            params.append(pair[0], sv);
        }
    } else {
        params = {};
        each(oriData, function (val, key) {
            if (isNil(val)) {
                return;
            }
            let sv = val;
            if (typeof val === 'string') {
                sv = trim(val);
            }
            set(params, key, sv);
        })
    }

    let token = appLocalStore(storageTokenKey(type));
    set(params, 'timestamp', Math.round(new Date().getTime() / 1000));
    const sign = appSign(params, token ? token : '');
    set(params, 'sign', sign);
    return params;
}

export const appRequest = (url: string, data?: any, config?: AxiosRequestConfig, type: string = 'backend') => {
    let token = appLocalStore(storageTokenKey(type));
    let oriConfig = config || {};
    let headers = {};
    if (token) {
        headers = merge(get(oriConfig, 'headers', {}), {
            'Authorization': `Bearer ${token}`,
        });
        oriConfig = {
            ...oriConfig,
            headers
        };
    }
    set(headers, 'x-type', type);
    oriConfig.headers = headers;
    let method = 'post';
    if (config && config.method) {
        method = config.method;
    }
    if (method === 'get') {
        oriConfig.params = appParams(data, type);
    }
    if (method === 'post') {
        oriConfig.data = appParams(data, type);
    }
    set(oriConfig, 'method', method);
    set(oriConfig, 'url', url);
    return pyRequest.request(oriConfig).then(res => {
        const { data = {}, status, message } = res.data;
        return Promise.resolve({
            success: Boolean(!status),
            message,
            status,
            data
        });
    }).catch(err => {
        const { status } = err;
        if (status === 401) {
            emitter.emit(REQUEST_401, err)
        } else {
            emitter.emit(REQUEST_EXCEPTION, err)
        }
        return Promise.reject(err);
    });
};
