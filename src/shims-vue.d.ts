declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'vue3-clipboard' {
    export function copyText(text: any, container?: string, callback?: Function): void;
}

declare module '*.json' {
    const value: any;
    export default value;
}