<template>
    <div class="app-modal__header">
        <div
            v-if="closeButton"
            class="app-modal__close"
            @click="close"
        >
            <i class="fa-solid fa-xmark" />
        </div>

        <div class="app-modal__header__content">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ModalHeader',
    }
</script>

<script setup>
    defineProps({
        closeButton: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['close'])

    const close = () => emit('close')
</script>
