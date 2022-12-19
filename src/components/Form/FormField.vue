<template>
    <div>
        <slot
            v-if="hasLabel"
            :id="id"
            :error="hasErrors"
            name="label"
        >
            <label
                :for="id"
                class="form__label"
            >
                {{ label }}
            </label>
        </slot>

        <slot
            :id="id"
            :error="hasErrors"
        />

        <InputErrors
            v-if="errors"
            :errors="errors"
        />
    </div>
</template>

<script setup lang="ts">
    import InputErrors from "~/components/Input/InputErrors.vue"

    const props = withDefaults(defineProps<{
        label?: string,
        errors?: string[],
    }>(), {
        label: null,
        errors: null,
    })

    const hasLabel = computed(() => {
        return props.label || 'label' in useSlots()
    })

    const id = computed(() => {
        return `form-field-${Math.round(Math.random() * 100000)}`
    })

    const hasErrors = computed(() => {
        return !! props.errors?.length
    })
</script>
