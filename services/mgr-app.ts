import request from "@/framework/utils/request";

export async function apiMgrAppHomeClearCache() {
    return request({
        url: '/api/backend/mgr-app/home/clear-cache'
    });
}


export async function apiMgrAppUserInfo() {
    return request({
        url: '/api/backend/mgr-app/user/info'
    });
}
