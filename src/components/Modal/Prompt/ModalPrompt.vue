<template>
    <ModalWrapper>
        <Card
            tag="form"
            @submit.prevent="confirm"
        >
            <template #title>
                <div class="px-8">
                    {{ text }}
                </div>
            </template>
            <template #default>
                <div v-if="description !== null">
                    {{ description }}
                </div>

                <div class="space-y-2">
                    <div
                        v-for="(field, $i) in fields"
                        :key="$i"
                    >
                        <label
                            v-if="field.label"
                            :for="`field-${$i}`"
                            class="form__label"
                        >
                            {{ field.label }}
                        </label>

                        <Component
                            :is="field.component || InputText"
                            :id="`field-${$i}`"
                            ref="fieldRef"
                            v-model="values[$i]"
                            class="w-full"
                            v-bind="field.props ?? {}"
                        />
                    </div>
                </div>

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
                        type="submit"
                        class="button--success"
                    >
                        {{ confirmButton ?? $__('Выполнить') }}
                    </AppButton>
                </div>
            </template>
        </Card>
    </ModalWrapper>
</template>

<script lang="ts">
    export default {
        name: "ModalPrompt",
    }
</script>

<script setup lang="ts">
    import {ModalWrapper, AppButton, InputText} from "#components"
    import type {Component} from "vue"
    import Card from "~/components/Card.vue"

    const props = withDefaults(defineProps<{
        text: string,
        description?: string,
        confirmButton?: string,
        cancelButton?: string | false,
        fields?: Array<{
            component?: Component | string,
            label?: string,
            props?: object,
        }>
    }>(), {
        text: null,
        description: null,
        confirmButton: null,
        cancelButton: null,
        fields: () => ([
            {
                component: InputText,
            },
        ]),
    })

    const emit = defineEmits(['reject', 'resolve', 'close'])

    const fieldRef = ref(null)

    onMounted(() => {
        nextTick(() => {
            fieldRef.value[0]?.focus()
        })
    })

    const values = reactive(props.fields.map(field => null))

    const cancel = () => {
        emit('reject', values.length === 1 ? values[0] : values)
        emit('close')
    }

    const confirm = () => {
        emit('resolve', values.length === 1 ? values[0] : values)
        emit('close')
    }
</script>
