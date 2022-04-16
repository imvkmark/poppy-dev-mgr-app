import { isString } from "lodash-es";
import { ElMessage } from "element-plus/es";
import { appMode, appUrl } from "@/services/utils/conf";
import { httpBuildQuery, localStore, sessionStore } from "@popjs/core/utils/helper";
import { isInteger } from "@popjs/core/utils/validate";


/**
 * 实现localStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const appLocalStore = (key: any, val?: any) => {
    return localStore(hashKey(key), val);
};

/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const appSessionStore = (key: any, val?: any) => {
    return sessionStore(hashKey(key), val);
};


/**
 * 通过域名 + 版本号摒弃缓存
 * 这个地方和清空缓存有关系, 注意使用, 这里必须要有 `:`
 * @returns {*}
 */
export const hashKey = (key: string) => {
    let genKey = `${appMode}:${key}`;
    if (genKey.indexOf(':') < 0) {
        console.error('生成的KEY不包含 :, 会导致清理缓存异常');
    }
    return genKey;
};

/**
 * 封装 ele 的状态显示
 * @param {string|object} resp
 * @param {boolean|string|integer} is_success
 */
export const toast = (resp: any, is_success: any = true) => {
    let type = is_success;
    if (isInteger(is_success)) {
        type = Boolean(is_success);
    }
    if (isString(resp)) {
        if (type === true) {
            ElMessage.success(resp);
        } else if (type === false) {
            ElMessage.warning(resp);
        } else {
            ElMessage.error(resp);
        }

    } else {
        const { message, status } = resp;
        if (status === 0) {                         // 成功
            ElMessage.success(message)
        } else if (status > 0 && status <= 1000) {  // http error
            ElMessage.error(message)
        } else {                                    // project error
            ElMessage.warning(message);
        }
    }
}

/**
 * 返回完整的Url 地址
 * @param {string} path   请求Url
 * @param {object} query 查询条件
 */
export const baseUrl = (path: string, query: any = {}) => {
    let baseUrl = appUrl;
    if (!baseUrl) {
        baseUrl = `${window.location.protocol}//${window.location.host}`
    }
    let newPath = path;
    if (path.indexOf('/') !== 0) {
        newPath = '/' + path;
    }
    return `${baseUrl}/${httpBuildQuery(newPath, query)}`
}


/**
 * 计算唯一KEY
 * @param name
 * @param params
 */
export const routerNameKey = (name: string, params: object = {}) => {
    let strParams = JSON.stringify(params);
    return `${name}${strParams}`;
}


/**
 * 进行浏览器警告, 便于项目寻找错误
 */
export const pyWarning = (...args: any[]) => {
    const debugTime = () => {
        const d = new Date();
        return '🕊 🕊 🕊 [' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds() + '] ';
    }
    console.warn(debugTime(), ...args);
}
