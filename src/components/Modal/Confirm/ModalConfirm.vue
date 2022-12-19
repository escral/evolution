<template>
    <ModalWrapper>
        <Tip
            :type="type"
            :title="text ?? $__('Выполнить действие?')"
            class="text-base max-w-md"
        >
            <div v-if="description !== null" v-html="description" />

            <div class="space-x-4 flex justify-between mt-4">
                <AppButton
                    text
                    class="button--gray"
                    @click="cancel"
                >
                    {{ cancelButton ?? $__('Отмена') }}
                </AppButton>
                <AppButton
                    ref="confirmButtonRef"
                    :class="{
                        'button--success': type !== MessageType.Danger,
                        'button--danger': type === MessageType.Danger,
                    }"
                    @click="confirm"
                >
                    {{ confirmButton ?? $__('Выполнить') }}
                </AppButton>
            </div>
        </Tip>
    </ModalWrapper>
</template>

<script lang="ts">
    import { MessageType } from "@/types/enums/MessageType"

    export default {
        name: "ModalConfirm",
    }
</script>

<script setup lang="ts">
    withDefaults(defineProps<{
        type?: MessageType,
        text?: string,
        description?: string,
        confirmButton?: string,
        cancelButton?: string,
    }>(), {
        type: MessageType.Warning,
        text: null,
        description: null,
        confirmButton: null,
        cancelButton: null,
    })

    const emit = defineEmits(['reject', 'resolve', 'close'])

    const confirmButtonRef = ref(null)

    onMounted(() => {
        nextTick(() => {
            confirmButtonRef.value.$el.focus()
        })
    })

    const cancel = () => {
        emit('reject', false)
        emit('close')
    }

    const confirm = () => {
        emit('resolve', true)
        emit('close')
    }
</script>
