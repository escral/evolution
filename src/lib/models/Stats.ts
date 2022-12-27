export default class Stats {
    declare health: number
    declare maxHealth: number
    declare damage: number
    declare speed: number

    constructor({ health, maxHealth, damage, speed }) {
        this.health = health
        this.maxHealth = maxHealth
        this.damage = damage
        this.speed = speed
    }
}