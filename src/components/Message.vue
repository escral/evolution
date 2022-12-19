<template>
    <div
        v-if="visible"
        class="message"
        :class="`message--${type}`"
        role="alert"
    >
        <i
            v-if="type === MessageType.Info"
            class="fa-solid fa-circle-info mr-4"
        />
        <i
            v-if="type === MessageType.Success"
            class="fa-solid fa-check mr-4"
        />
        <i
            v-if="type === MessageType.Warning"
            class="fa-solid fa-triangle-exclamation mr-4"
        />

        <slot />

        <div
            v-if="closable"
            class="p-1 px-2 cursor-pointer hover:text-black ml-auto"
            @click="close"
        >
            <i class="fa-solid fa-xmark" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useClosable } from "~/composables/useClosable"
    import { MessageType } from "~/types/enums/MessageType"

    const props = withDefaults(defineProps<{
        closable?: string,
        type?: MessageType,
    }>(), {
        closable: null,
        type: MessageType.Info,
    })

    const { visible, close } = useClosable('message:' + props.closable)
</script>
