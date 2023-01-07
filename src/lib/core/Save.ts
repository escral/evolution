import * as devalue from "devalue"
import { useStageStore } from "@/store/useStageStore"

export default class Save {
    declare version: string
    declare date: Date
    declare data: any

    constructor(data: any) {
        this.version = data.version
        this.date = data.date
        this.data = data.data
    }

    static create() {
        const data = {
            player: {
                money: useStageStore().money,
            },
        }

        return new Save({
            version: '0.0.1',
            date: new Date(),
            data,
        })
    }

    encode() {
        return JSON.stringify(this)
    }

    static decode(data: string) {
        try {
            return new Save(JSON.parse(data))
        } catch (error) {
            console.error(error)
            return null
        }
    }

    write() {
        localStorage.setItem('save', this.encode())
    }

    static getCurrentSave() {
        return this.getSaveByName('save')
    }

    static getSaveByName(name: string) {
        const data = localStorage.getItem(name)

        if (data) {
            return Save.decode(data)
        }
    }

    load() {
        useStageStore().money = this.data.player.money
    }
}