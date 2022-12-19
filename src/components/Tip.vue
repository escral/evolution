<template>
    <div
        v-if="visible"
        class="tip"
        :class="`tip--${type}`"
        role="alert"
    >
        <div class="tip__header">
            <slot name="icon">
                <i
                    v-if="type === MessageType.Info"
                    v-tooltip="tooltip"
                    class="fa-solid fa-circle-info mr-2"
                />
                <i
                    v-if="type === MessageType.Success"
                    v-tooltip="tooltip"
                    class="fa-solid fa-check mr-2"
                />
                <i
                    v-if="type === MessageType.Warning"
                    v-tooltip="tooltip"
                    class="fa-solid fa-triangle-exclamation mr-2"
                />
                <i
                    v-if="type === MessageType.Danger"
                    v-tooltip="tooltip"
                    class="fa-solid fa-triangle-exclamation mr-2"
                />
            </slot>

            {{ title ?? defaultTitle }}
        </div>

        <div class="tip__content">
            <slot />
        </div>

        <div
            v-if="closable"
            v-tooltip="$__('Закрыть')"
            class="tip__close"
            @click="close"
        >
            <i class="fa-solid fa-xmark" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { MessageType } from "~/types/enums/MessageType"

    const { $__ } = useNuxtApp()

    import { useClosable } from "~/composables/useClosable"

    const props = withDefaults(defineProps<{
        title?: string,
        closable?: string,
        type?: MessageType,
        tooltip?: AnyObject,
    }>(), {
        title: null,
        closable: null,
        type: MessageType.Info,
        tooltip: null,
    })

    const defaultTitle = computed(() => {
        if (props.type === MessageType.Success) {
            return $__('Успех')
        }

        if (props.type === MessageType.Warning) {
            return $__('Внимание')
        }

        return $__('Совет')
    })

    const { visible, close } = useClosable('tip:' + props.closable)
</script>
