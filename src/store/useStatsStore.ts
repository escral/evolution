import { defineStore } from "pinia"

export const useStatsStore = defineStore('stats', {
    state: () => ({
        health: 100,
        healthTotal: 100,
    }),
})