export default class Timer {
    declare value: number | null

    constructor(value = null) {
        this.value = value
    }

    enoughTimePassed(time: number) {
        return this.value >= time
    }

    increment(elapsed: number) {
        if (this.value === null) {
            this.value = elapsed
        } else {
            this.value += elapsed
        }
    }

    reset() {
        this.value = null
    }
}