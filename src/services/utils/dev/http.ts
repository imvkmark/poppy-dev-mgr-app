import { deviceId } from "@/services/utils/util";
import { get, merge } from 'lodash-es';
import UAParser from "ua-parser-js";
import axios, { AxiosInstance } from "axios";
import { PyRequestOptions } from "@/services/utils/types";
import { pyAppUrl, pyAppVersion } from "@/services/utils/conf";

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


// 请求方法
const http = (options: PyRequestOptions) => {
    let { method = 'post', params = {}, url, headers = {} } = options;

    console.info(options.url, params);
    // stip : 这里使用 data = {...params, token : token || ''}, 则会丢失form表单的数据

    let ua = new UAParser();

    let xHeaders: any = {
        'x-ver': pyAppVersion,
        'x-id': deviceId(),
        'x-sys-name': ua.getOS().name,
        'x-sys-version': ua.getOS().version,
        'x-sys-device': `${get(ua.getDevice(), 'type', '')}/${get(ua.getDevice(), 'vendor', '')}/${get(ua.getDevice(), 'model', '')}`,
        'x-sys-cpu': get(ua.getCPU(), 'architecture', ''),
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/json'
    }

    let xAuthHeaders = merge(xHeaders, headers);
    console.log(xAuthHeaders);
    switch (method.toLowerCase()) {
        case 'get':
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
