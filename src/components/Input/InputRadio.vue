<template>
    <input
        :id="uid"
        type="radio"
        :required="required"
        :disabled="disabled"
        :checked="checked"
        :value="value"
        :name="name"
        :class="{
            '--small': small
        }"
        @input="check"
        @click="checkCheckbox"
    >
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        value: any,
        modelValue: any,
        name: string,
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

    const checked = computed(() => props.value === props.modelValue)

    const check = (event) => {
        let value = event.target.value

        if ((typeof props.value === 'boolean') && (typeof value !== 'boolean')) {
            value = (value === 'true')
        }

        emit('update:modelValue', value)
    }

    const checkCheckbox = (event) => {
        const value = event.target.value

        if (props.value === value) {
            emit('update:modelValue', null)
        }
    }

    const uid = `input-radio-${Math.round(Math.random() * 100000)}`
</script>
