export type AnyObject = {
    [field: string | number]: any
}

export type Point = {
    x: number,
    y: number,
}

export type Input = {
    up: number,
    down: number,
    left: number,
    right: number,
    space: number,
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $__: (text: string) => text
    }
}