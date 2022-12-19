import { Component } from "vue"

export type ContextMenuOption = {
    text: string,
    icon?: string | typeof Component,
    onClick?: () => void
    keep?: boolean,
    class?: string,
}
