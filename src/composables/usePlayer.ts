import * as PIXI from "pixi.js"

const createCircle = () => {
    const element = new PIXI.Graphics()
    element.beginFill(0xFFFFFF)
    element.drawCircle(10, 10, 10)
    element.endFill()
    element.pivot.set(10, 10)

    return element
}

export default function usePlayer() {
    const create = () => {
        return createCircle()
    }

    return {
        create,
    }
}