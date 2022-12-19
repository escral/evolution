<template>
    <slot
        name="header"
        :close="close"
    >
        <ModalHeader
            v-if="header !== false"
            :close-button="closeButton"
            @close="close"
        >
            {{ header }}
        </ModalHeader>
    </slot>

    <div
        ref="container"
        class="app-modal__container"
    >
        <slot :close="close" />
    </div>
</template>

<script>
    export default {
        name: 'ModalWrapper',
    }
</script>

<script setup>
    import {disableBodyScroll} from 'body-scroll-lock'

    import {ModalHeader} from "#components"

    const props = defineProps({
        header: {
            type: [String, Boolean],
            default: false,
        },
        closeButton: {
            type: [Boolean],
            default: false,
        },
        scrollLock: {
            type: Boolean,
            default: false,
        },
    })

    const emit = defineEmits(['close'])

    const close = () => emit('close')

    const container = ref(null)

    onMounted(() => {
        if (props.scrollLock) {
            disableBodyScroll(container.value)
        }
    })
</script>
