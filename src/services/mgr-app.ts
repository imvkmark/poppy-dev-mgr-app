import request from "@/utils/request";

export async function apiMgrAppHomeClearCache() {
    return request({
        url: '/api/backend/py-mgr-app/home/clear-cache'
    });
}


export async function apiMgrAppUserInfo() {
    return request({
        url: '/api/backend/py-mgr-app/user/info'
    });
}
