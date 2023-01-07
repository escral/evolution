<template>
    <UI class="flex items-center justify-center">
        <Menu :items="menu" />
    </UI>
</template>

<script setup>
    import Menu from "@/components/Menu.vue"
    import UI from "@/components/UI.vue"
    import { useRouter } from "vue-router"
    import Save from "@/lib/core/Save"

    const router = useRouter()

    const save = () => {
        const newSave = Save.create()

        newSave.write()
    }

    const currentSave = Save.getCurrentSave()

    const load = () => {
        if (currentSave) {
            currentSave.load()
        }
    }

    const menu = [
        {
            text: currentSave ? 'Continue' : 'New game',
            class: 'bg-green-500 hover:bg-green-600',
            onClick: () => {
                router.push({ name: 'map' })
            },
        },
        {
            text: 'Save',
            onClick: save,
        },
        {
            text: 'Load',
            onClick: load,
        },
        {
            text: 'Settings',
            onClick: () => {
                router.push({ name: 'settings' })
            },
        },
        {
            text: 'Exit',
            class: 'bg-red-500 hover:bg-red-600',
        },
    ]
</script>