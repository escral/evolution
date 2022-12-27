import { Graphics } from "pixi.js"

export const createCircle = (): Graphics => {
    const element = new Graphics()
    element.beginFill(0xFFFFFF)
    element.drawCircle(10, 10, 10)
    element.endFill()
    element.pivot.set(10, 10)

    return element
}