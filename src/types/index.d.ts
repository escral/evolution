export type AnyObject = {
    [field: string | number]: any
}

export type Point = {
    x: number,
    y: number,
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $__: (text: string) => text
    }
}