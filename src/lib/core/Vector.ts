export default class Vector {
    declare x: number
    declare y: number

    constructor(x: number, y: number)
    constructor(data: { x: number, y: number })

    constructor(x: number | { x: number, y: number }, y?: number)
    {
        if (typeof x === 'number') {
            this.x = x
            this.y = y
        } else {
            this.x = x.x
            this.y = x.y
        }
    }

    static null() {
        return new Vector(0, 0)
    }

    isNull() {
        return this.x === 0 && this.y === 0
    }

    normalize() {
        const length = this.length

        this.x = this.x / length
        this.y = this.y / length

        return this
    }

    convert() {
        this.y = -this.y

        return this
    }

    normalized() {
        const length = this.length

        if (length === 0) {
            return Vector.null()
        }

        return new Vector(this.x / length, this.y / length)
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    get angle() {
        return -Math.atan2(this.x, this.y)
    }

    static fromPoints(p1, p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y)
    }

    domPoint() {
        return new DOMPoint(this.x, this.y)
    }

    matrixTransform() {
        const m = new DOMMatrix()
        return m.translateSelf(this.x, this.y)
    }

    perpendicular() {
        return new Vector(-this.y, this.x)
    }

    flipped() {
        return new Vector(-this.x, -this.y)
    }

    multiply(value) {
        this.x *= value
        this.y *= value

        return this
    }

    multiplied(value) {
        return new Vector(this.x * value, this.y * value)
    }

    add(value) {
        this.x += value.x
        this.y += value.y

        return this
    }

    added(value) {
        return new Vector(this.x + value.x, this.y + value.y)
    }

    clone() {
        return new Vector(this.x, this.y)
    }

    toSvgSystem() {
        this.y = -this.y

        return this
    }

    rotate(angle) {
        const x = Math.cos(-angle * (Math.PI / 180)) * this.x - Math.sin(-angle * (Math.PI / 180)) * this.y
        const y = Math.sin(-angle * (Math.PI / 180)) * this.x + Math.cos(-angle * (Math.PI / 180)) * this.y

        this.x = Math.round(x * 10000) / 10000
        this.y = Math.round(y * 10000) / 10000

        return this
    }

    angleBetween(vector) {
        return (Math.atan2(vector.x, vector.y) - Math.atan2(this.x, this.y))
    }
}