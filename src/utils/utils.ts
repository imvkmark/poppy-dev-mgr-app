/**
 * 计算唯一KEY
 * @param name
 * @param params
 */
export const routerNameKey = (name: string, params: object = {}) => {
    let strParams = JSON.stringify(params);
    return `${name}${strParams}`;
}
