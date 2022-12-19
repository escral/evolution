<template>
    <textarea
        ref="input"
        :class="{
            'text-sm px-2.5 py-1.5': small,
            'text-xs px-2 py-1': smallest,
            'text-center': center,
            'border-red-300': error,
        }"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :maxlength="maxlength"
        v-bind="extraAttributes"
        @input="$emit('update:modelValue', castValue( $event.target.value))"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @change="$emit('change', $event)"
        @keypress.enter.ctrl="$emit('enter', $event)"
        @keypress.esc="$emit('esc', $event)"
    />
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        modelValue?: string | number,
        type?: string,
        placeholder?: string,
        small?: boolean,
        smallest?: boolean,
        center?: boolean,
        required?: boolean,
        focused?: boolean,
        selected?: boolean,
        error?: boolean,
        maxlength?: number,
        extraAttributes?: object,
    }>(), {
        modelValue: null,
        type: 'text',
        maxlength: 2000,
        placeholder: null,
        extraAttributes: () => ({}),
    })

    defineEmits(['blur', 'change', 'focus', 'enter', 'esc', 'update:modelValue'])

    onMounted(() => {
        if (props.focused) {
            focus()
        }
        if (props.selected) {
            select()
        }
    })

    const input = ref(null)

    const focus = () => {
        input.value.focus()
    }

    const select = () => {
        input.value.select()
    }

    const castValue = (value) => {
        if (props.type === 'number') {
            return Number(value)
        }

        return value
    }

    defineExpose({
        focus,
    })
</script>

