import type Item from "@/types/models/Item"

export type InventoryItem = {
    info: Item,
    quantity: number,
}

export default class Inventory {
    declare items: Map<Item['id'], InventoryItem>

    constructor(items: InventoryItem[] = []) {
        this.items = new Map(items.map(i => [i.info.id, i]))
    }

    addItem(item: Item, quantity = 1) {
        if (this.hasItemById(item.id)) {
            this.items.get(item.id).quantity += quantity
        } else {
            this.items.set(item.id, {
                info: item,
                quantity,
            })
        }
    }

    removeItem(item: Item) {
        if (this.hasItem(item)) {
            this.items.delete(item.id)
        }
    }

    removeItems(items: Item[]) {
        items.forEach(item => this.removeItem(item))
    }

    removeItemById(id: number) {
        this.removeItem(this.getItemById(id).info)
    }

    removeItemsById(ids: number[]) {
        ids.forEach(id => this.removeItemById(id))
    }

    hasItem(item: Item) {
        return this.items.has(item.id)
    }

    hasItems(items: Item[]) {
        return items.every(item => this.hasItem(item))
    }

    hasItemById(id: number) {
        return this.items.has(id)
    }

    hasItemsById(ids: number[]) {
        return ids.every(id => this.hasItemById(id))
    }

    getItemById(id: number) {
        return this.items.get(id)
    }

    getItemsById(ids: number[]) {
        return ids.map(id => this.getItemById(id))
    }
}