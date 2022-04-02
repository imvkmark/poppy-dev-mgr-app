import { MD5 } from "crypto-js";
import { httpBuildQuery, isInteger, uniqueId } from "@/services/utils/helper";
import { each, forEach, isString } from "lodash-es";
import { ElMessage } from "element-plus/es";
import { pyAppMode, pyAppUrl, pyStorageKey } from "@/services/utils/conf";


/**
 * 实现localStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const localStore = (key: any, val?: any) => {
    return _localStore(hashKey(key), val);
};

/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
export const sessionStore = (key: any, val?: any) => {
    return _sessionStore(hashKey(key), val);
};


/**
 * 通过域名 + 版本号摒弃缓存
 * 这个地方和清空缓存有关系, 注意使用, 这里必须要有 `:`
 * @returns {*}
 */
export const hashKey = (key: string) => {
    let genKey = `${pyAppMode}:${key}`;
    if (genKey.indexOf(':') < 0) {
        console.error('生成的KEY不包含 :, 会导致清理缓存异常');
    }
    return genKey;
};


/**
 * 返回设备ID, 如果本地存在则取本地
 */
export const deviceId = (): string => {
    const val = localStore(pyStorageKey.deviceId)
    if (val) {
        return val;
    } else {
        let id = 'h-' + MD5(uniqueId('poppy')) + '-5'
        localStore(pyStorageKey.deviceId, id);
        return id;
    }
}


/**
 * 设置获取Store 的内容
 * @param {string|array} key
 * @param val
 * @returns
 */
function _localStore(key: any, val: any) {
    /**
     * localStorage内存溢出时，则清空后继续保存
     * @param {string} key 缓存key
     * @param {string} data JSON.stringify后的数据
     */
    let _localStorageOverflow = (key: any, data: any) => {
        try {
            localStorage.setItem(key, data);
        } catch (e: any) { // 当缓存溢出，则清空后继续保存
            if (e.code === 'QUOTA_EXCEEDED_ERR_CODE') {
                localStorage.removeItem(key);
                localStorage.setItem(key, data);
            } else {
                console.error(e);
            }
        }
    };

    // 本地数据存储封装，没有过期时间限制，仅限于该页面的协议
    if (val === null) {
        if (typeof key === 'object') {
            each(key, function (ele, idx) {
                _localStorageOverflow(idx, ele); // 存储数据
            });
            return;
        } else {
            localStorage.removeItem(key);// 移除数据
            return;
        }
    }
    if (typeof val === 'undefined') {
        let data = localStorage.getItem(key);
        if (data) {
            try {
                data = JSON.parse(data);
                return data; // 获取数据
            } catch (err) {
                return data; // 获取数据
            }
        }
        return data; // 获取数据
    }
    if (typeof val === 'object') {
        _localStorageOverflow(key, JSON.stringify(val));
    } else {
        _localStorageOverflow(key, val);
    }
}


/**
 * 实现sessionStorage缓存的 存, 取, 删操作
 * @param key 对象, 批量设置
 * @param val 有值:设置; 无值: 获取; null, 删除;
 */
function _sessionStore(key: any, val: any) {  // 本地数据存储封装，随页面回话结束而结束，仅限于该页面的协议
    if (val === null) {
        if (typeof key === 'object') {
            forEach(key, function (ele, idx) {
                sessionStorage.setItem(idx, ele);
            });
            return;
        } else {
            sessionStorage.removeItem(key);
            return;
        }
    }
    if (typeof val === 'undefined') {
        let data = sessionStorage.getItem(key);
        if (data) {
            try {
                data = JSON.parse(data);
                return data; // 获取数据
            } catch (err) {
                return sessionStorage.getItem(key); // 获取数据
            }
        }
        return data; // 获取数据
    }
    if (typeof val === 'object') {
        sessionStorage.setItem(key, JSON.stringify(val));
    } else {
        sessionStorage.setItem(key, val);
    }
}


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
    let baseUrl = pyAppUrl;
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

