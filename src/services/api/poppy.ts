import { appRequest } from '../utils/request';
import { Method } from "axios";
import { pyWarning } from "@/services/utils/util";

/**
 * 发送验证码
 */
export async function apiPySystemCaptchaSend(params: object) {
    return appRequest('/api_v1/system/captcha/send', params);
}


export async function apiPySystemAuthLogin(params: object, type: string = 'backend') {
    pyWarning(params);
    return appRequest('/api_v1/system/auth/login', params, {}, type);
}


/**
 *上传图片
 */
export function apiPySystemUploadImage(image: any) {
    const data = new FormData()
    data.set('image', image, image.name)
    return appRequest('api_v1/system/upload/image', data);
}

/**
 *上传图片
 */
export function apiPySystemUploadFile(image: any, type: string) {
    const data = new FormData()
    data.set('file', image, image.name);
    data.set('type', type);
    return appRequest('api_v1/system/upload/file', data);
}


/**
 * 退出登录
 */
export async function apiPySystemAuthLogout() {
    return appRequest('/api_v1/system/auth/logout');
}

/**
 * Core Info
 */
export async function apiPySystemCoreInfo() {
    return appRequest('/api_v1/system/core/info');
}

export async function apiPyRequest(url: string, params: object, method: Method = 'post') {
    return appRequest(url, params, {
        method: method
    });
}
