import Stats from "@/lib/models/Stats"

export default class PlayerStats extends Stats {
    declare pickupDistance: number

    constructor(data) {
        super(data)

        this.pickupDistance = data.pickupDistance
    }
}