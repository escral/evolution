<template>
    <component
        :is="tag"
        class="dropdown"
        :class="{
            'dropdown--opened': isActive,
        }"
    >
        <slot
            name="toggle"
            :is-active="isActive"
            :close="close"
            :open="open"
            :toggle="toggle"
        />

        <Teleport
            :to="teleportPosition"
            :disabled="!teleportPosition"
        >
            <div
                ref="contentRef"
                class="dropdown__content"
                tabindex="-1"
                :class="{
                    'w-full': full,
                }"
            >
                <Transition
                    :name="transition"
                    appear
                >
                    <slot
                        v-if="isActive"
                        name="content"
                        :is-active="isActive"
                        :close="close"
                        :open="open"
                        :toggle="toggle"
                    />
                </Transition>
            </div>
        </Teleport>
    </component>
</template>

<script setup lang="ts">
    import { createPopper, type Placement, type Options } from "@popperjs/core"
    import { type MaybeElementRef, onClickOutside, useCurrentElement } from "@vueuse/core"
    import {
        computed,
        onBeforeUnmount,
        onMounted,
        ref,
        watch,
    } from "vue"

    const props = withDefaults(defineProps<{
        tag?: string,
        full?: boolean,
        placement?: Placement,
        transition?: string,
        closeOnClickOutside?: boolean,
        ignoreClickOnElements?: MaybeElementRef[],
        unstoppableClose?: boolean,
        teleport?: boolean | string,
        popperOptions?: Options,
    }>(), {
        tag: 'div',
        full: false,
        placement: 'bottom-start',
        transition: 'slide-fade',
        closeOnClickOutside: true,
        ignoreClickOnElements: () => [],
        unstoppableClose: true,
        teleport: false,
        popperOptions: null,
    })

    const emit = defineEmits(['open', 'close', 'toggle', 'click-outside'])

    const isActive = ref(false)
    const contentRef = ref(null)

    let popperInstance

    const el = useCurrentElement()

    watch(isActive, () => {
        if (!isActive.value) {
            return
        }

        const toggle = el.value.children[0] as HTMLElement

        if (!toggle) {
            return
        }

        const content = contentRef.value

        if (!content) {
            return
        }

        initPopper(toggle, content)

        popperInstance.forceUpdate()
    }, { immediate: true })

    onMounted(() => {
        if (props.closeOnClickOutside) {
            onClickOutside(el.value as HTMLElement, handleClickOutside, {
                ignore: [
                    contentRef.value,
                    ...props.ignoreClickOnElements,
                ],
                capture: props.unstoppableClose,
            })
        }
    })

    onBeforeUnmount(() => {
        if (popperInstance) {
            popperInstance.destroy()
        }
    })

    const initPopper = (reference, popper) => {
        popperInstance = createPopper(reference, popper, Object.assign({
            placement: props.placement,
        }, props.popperOptions))
    }

    const handleClickOutside = (event = null) => {
        close(event)
        emit('click-outside', event)
    }

    const close = (event = null) => {
        if (!props.unstoppableClose && event && event.eventPhase === 0) {
            return
        }

        isActive.value = false

        emit('open')
        emit('toggle', isActive.value)
    }

    const open = () => {
        isActive.value = true

        emit('open')
        emit('toggle', isActive.value)
    }

    const toggle = () => {
        if (isActive.value) {
            close()
        } else {
            open()
        }
    }

    const teleportPosition = computed(() => {
        if (typeof props.teleport === 'boolean') {
            return props.teleport ? 'body' : null
        }

        return props.teleport
    })

    defineExpose({
        open,
        close,
        toggle,
        isActive,
    })
</script>
