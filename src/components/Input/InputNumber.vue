<template>
    <div
        class="input-number"
        :class="{
            'input-number--disabled': attributes.disabled,
            'input-number--readonly': attributes.readonly,
            'input-number--normal': normal,
            'input-number--large': !normal,
            'border-red': true,
        }"
        v-bind="{
            class: passedAttrs.class,
        }"
    >
        <div class="input-number__arrow input-number__arrow--up" @mousedown.capture="startIncrement">
            <Icon icon="fa-solid fa-caret-up" />
        </div>
        <div class="input-number__arrow input-number__arrow--down" @mousedown.capture="startDecrement">
            <Icon icon="fa-solid fa-caret-down" />
        </div>

        <InputText
            ref="input"
            v-bind="attributes"
            v-on="useInheritEvents([
                'update:modelValue',
                'blur',
                'focus',
                'change',
                'enter',
                'esc',
            ])"
        />
    </div>
</template>

<script lang="ts">
    export default {
        inheritAttrs: false,
    }
</script>

<script setup lang="ts">
    import InputText from "~/components/Input/InputText.vue"

    const passedAttrs = computed<AnyObject>(() => useAttrs())

    withDefaults(defineProps<{
        normal?: boolean,
    }>(), {
        normal: false,
    })

    const attributes = computed<AnyObject>(() => ({
        type: 'number',
        min: 0,
        maxLength: null,
        step: 1,
        ...passedAttrs.value,
        class: null,
    }))

    const emit = defineEmits([
        'update:modelValue',
        'blur',
        'focus',
        'change',
        'enter',
        'esc',
    ])

    const input = ref(null)

    let timeout
    let interval

    const getMultiply = (e) => {
        if (e.shiftKey) {
            return 10
        } else if (e.ctrlKey) {
            return 100
        }

        return 1
    }

    const start = (fn) => {
        document.addEventListener('mouseup', stop)

        input.value.$el.classList.add('--focused')

        timeout = setTimeout(() => {
            document.addEventListener('mousedown', stop)

            interval = setInterval(() => {
                fn()
            }, 50)
        }, 400)
    }

    const startIncrement = (e) => {
        const multiply = getMultiply(e)

        increment(multiply)

        start(() => increment(multiply))
    }

    const startDecrement = (e) => {
        const multiply = getMultiply(e)

        decrement(multiply)

        start(() => decrement(multiply))
    }

    const stop = () => {
        if (timeout) {
            clearTimeout(timeout)
        }

        if (interval) {
            clearInterval(interval)
        }

        input.value.$el.classList.remove('--focused')

        input.value.focus()

        document.removeEventListener('mouseup', stop)
        document.removeEventListener('mousedown', stop)
    }

    onUnmounted(() => {
        document.removeEventListener('mouseup', stop)
        document.removeEventListener('mousedown', stop)
    })

    const increment = (multiply) => {
        const currentValue = Number(input.value.$el.value)

        let newValue = currentValue + attributes.value.step * multiply

        if (attributes.value.max ?? false) {
            newValue = Math.min(attributes.value.max, newValue)
        }

        emit('update:modelValue', newValue)
    }

    const decrement = (multiply) => {
        const currentValue = Number(input.value.$el.value)

        let newValue = currentValue - attributes.value.step * multiply

        if (attributes.value.min !== null) {
            newValue = Math.max(attributes.value.min, newValue)
        }

        emit('update:modelValue', newValue)
    }

    defineExpose({
        focus: () => input.value.focus(),
        select: () => input.value.select(),
    })
</script>

