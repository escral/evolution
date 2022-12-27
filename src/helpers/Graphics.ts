import { Graphics } from "pixi.js"

export const createCircle = (radius, color = 0xFFFFFF): Graphics => {
    const element = new Graphics()
    element.beginFill(color)
    element.drawCircle(radius, radius, radius)
    element.endFill()
    element.pivot.set(radius, radius)

    return element
}