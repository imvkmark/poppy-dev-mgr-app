/**
 * Url 地址
 * @param width
 * @param height
 */
export const fakerImageUrl: (width: number, height: number) => string = function (width: number = 20, height: number = 20): string {
    return `https://jdc.jd.com/img/${width}x${height}`;
};
