import { appRequest } from "../utils/request";

export async function apiMgrAppHomeClearCache() {
    return appRequest('/api/mgr-app/default/home/clear-cache');
}

export async function apiMgrAppUserInfo() {
    return appRequest('/api/mgr-app/default/user/info');
}
