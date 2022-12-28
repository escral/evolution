import type { DisplayObject } from "pixi.js"

export default class Element {
    declare element: DisplayObject

    constructor(element: DisplayObject) {
        this.element = element
    }

    destroy() {
        this.element.destroy()
    }
}