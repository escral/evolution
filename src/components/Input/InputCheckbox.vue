<template>
    <input
        v-model="value"
        type="checkbox"
        :required="required"
        :disabled="disabled"
        :class="{
            '--small': small
        }"
    >
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        modelValue: any,
        success?: boolean,
        disabled?: boolean,
        required?: boolean,
        small?: boolean,
        checkbox?: boolean,
    }>(), {
        success: false,
        disabled: false,
        required: false,
        small: false,
        checkbox: false,
    })

    const emit = defineEmits(['update:modelValue'])

    const value = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        },
    })
</script>
