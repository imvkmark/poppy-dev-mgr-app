/**
 * Oss 图片预览
 * @param url
 * @param width
 */
export const ossResizeImage = (url: string, width: number = 40) => {
    if (url.indexOf('?') >= 0) {
        return url;
    }
    return `${url}?x-oss-process=image/resize,h_${width},m_lfit`
}
