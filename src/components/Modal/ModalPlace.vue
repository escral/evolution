<template>
    <TransitionGroup
        name="app-modal"
        appear
    >
        <Modal
            v-for="[key, modal] in modals"
            :key="key"
            :modal-key="key"
            v-bind="modal.options"
        >
            <template #default="{ close }">
                <Component
                    :is="modal.component"
                    v-bind="modal.payload"
                    @close="close"
                    @resolve="modal.options.resolve"
                    @reject="modal.options.reject"
                />
            </template>
        </Modal>
    </TransitionGroup>
</template>

<script>
    export default {
        name: 'ModalPlace',
    }
</script>

<script setup>
    // @todo Modal is not closing in production build

    import { clearAllBodyScrollLocks } from "body-scroll-lock"

    import { Modal } from "#components"

    const { $modals: allModals } = useNuxtApp()

    const props = defineProps({
        name: {
            type: String,
            default: null,
        },
    })

    const modals = computed(() => {
        return [...allModals.entries()].filter(([key, value]) => value.options.place === props.name)
    })

    onMounted(() => {
        watch(modals, () => {
            if (!modals.value.length) {
                clearAllBodyScrollLocks()
            }
        })
    })
</script>
