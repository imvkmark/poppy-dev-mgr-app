import { pyAppUrl } from "@/framework/utils/conf";

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
 * 完整的Url
 * @param path
 */
export const routerFullUrl = (path: string) => {
    let baseUrl = pyAppUrl;
    if (!baseUrl) {
        baseUrl = `${window.location.protocol}//${window.location.host}`
    }
    let newPath = path;
    if (path.indexOf('/') !== 0) {
        newPath = '/' + path;
    }
    return baseUrl + newPath
}
