import { deviceId, localStore } from "@/services/utils/util";
import { each, forEach, get, isNaN, isNil, isObject, keys, set, trim, unset } from 'lodash-es';
import { MD5 } from 'crypto-js';
import UAParser from "ua-parser-js";
import axios, { AxiosInstance } from "axios";
import { PyRequestOptions } from "@/services/utils/types";
import { pyAppUrl, pyAppVersion, pyStorageKey } from "@/services/utils/conf";

// axios instance
// todo https://juejin.cn/post/6997805598507008007
// 这里需要细致化请求
// 拦截器可以查看 : https://axios-http.com/zh/docs/interceptors
let url = pyAppUrl;
if (!url) {
    url = `${window.location.protocol}//${window.location.host}`
}

const instance: AxiosInstance = axios.create({
    baseURL: url,
    timeout: 20000 // 请求超时 20s
});
// 添加请求拦截器
/*
instance.interceptors.utils.use(
    (config) => {
        // 在发送请求之前做些什么 token
        if (Session.get('token')) {
            config.headers.common['Authorization'] = `${Session.get('token')}`;
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
 */


/**
 * 加密串生成
 * @param {object} params 请求接口时的参数
 * @param {string} token token字段
 * @returns {string}
 * @private
 */
const requestSign = (params: any, token = '') => {
    let debug = false;
    let kvStr = '';
    let arrKeys = keys(params);
    arrKeys.sort();
    forEach(arrKeys, function (key) {
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


// 请求方法
const http = (options: PyRequestOptions, type = 'backend') => {
    let { method = 'post', params: oriParams = {}, url, headers = {} } = options;
    console.log(options);
    let params: any;
    if (oriParams instanceof FormData) {
        params = new FormData();
        for (let pair of oriParams.entries()) {
            if (isNil(pair[1])) {
                return;
            }
            if (isNaN(pair[1])) {
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
        each(oriParams, function (val, key) {
            if (isNil(val)) {
                return;
            }
            if (isNaN(val)) {
                return;
            }
            let sv = val;
            if (typeof val === 'string') {
                sv = trim(val);
            }
            set(params, key, sv);
        })
    }

    let token = localStore(`${pyStorageKey.token}-${type}`);
    set(params, 'timestamp', Math.round(new Date().getTime() / 1000));
    const sign = requestSign(params, token ? token : '');
    set(params, 'sign', sign);

    console.info(options.url, params);
    // stip : 这里使用 data = {...params, token : token || ''}, 则会丢失form表单的数据

    let ua = new UAParser();

    let xHeaders: any = {
        'x-type': type,
        'x-os': 'mgrapp',
        'x-ver': pyAppVersion,
        'x-id': deviceId(),
        'x-sys-name': ua.getOS().name,
        'x-sys-version': ua.getOS().version,
        'x-sys-device': `${get(ua.getDevice(), 'type', '')}/${get(ua.getDevice(), 'vendor', '')}/${get(ua.getDevice(), 'model', '')}`,
        'x-sys-cpu': get(ua.getCPU(), 'architecture', ''),
        'X-Requested-With': 'XMLHttpRequest',
    }

    let contentType = get(headers, 'Content-Type', 'application/json');
    unset(headers, 'Content-Type');

    let xAuthHeaders = {
        'Content-Type': contentType,
        'Authorization': token ? `Bearer ${token}` : '',
        ...xHeaders, ...headers
    }
    switch (method.toLowerCase()) {
        case 'get':
            set(params, 'token', token ? token : '');
            return instance.get(url, {
                params,
                headers: xHeaders
            });
        case 'post':
        default:
            return instance.post(url, params, {
                headers: xAuthHeaders
            });
        case 'put':
            return instance.put(url, params, {
                headers: xAuthHeaders
            });
    }
};

export default http;
