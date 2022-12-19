<template>
    <div
        :id="keyIsString ? modalKey : null"
        class="app-modal"
        :class="classes"
        v-bind="bind"
        @click.self="close"
    >
        <slot
            :close="close"
            :scroll-lock="scrollLock"
        />
    </div>
</template>

<script>
    export default {
        name: 'Modal',
        inheritAttrs: false,
    }
</script>

<script setup>
    const {$hideModal} = useNuxtApp()

    const props = defineProps({
        position: {
            type: String,
            default: 'center',
        },
        modalKey: {
            type: [String, Number, Object],
            required: true,
        },
        scrollLock: {
            type: Boolean,
            default: false,
        },
        bind: {
            type: Object,
            default: () => ({}),
        },
        reject: {
            type: Function,
            default: null,
        },
        place: {
            type: String,
            default: null,
        },

        //

        onMounted: {
            type: Function,
            default: null,
        },
        onUnmounted: {
            type: Function,
            default: null,
        },
    })

    const classes = computed(() => {
        const classes = []

        classes.push('app-modal--' + props.position)

        if (!!props.place) {
            classes.push('app-modal--absolute')
        }

        return classes
    })

    const keyIsString = computed(() => typeof props.modalKey === 'string')

    const close = () => {
        $hideModal(props.modalKey)

        if (props.reject) {
            props.reject()
        }
    }

    const closeOnEsc = (event) => {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        if (event.key === 'Escape') {
            close()
        }
    }

    onMounted(() => {
        window.addEventListener('keyup', closeOnEsc, {once: true})

        if (props.onMounted) {
            props.onMounted()
        }
    })

    onUnmounted(() => {
        window.removeEventListener('keyup', closeOnEsc)

        if (props.onUnmounted) {
            props.onUnmounted()
        }
    })
</script>
