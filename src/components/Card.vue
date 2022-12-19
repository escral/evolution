<template>
    <Component
        :is="tag"
        class="card relative"
        :class="{
            'card--fit': fit,
            'card--center': center || step,
            'card--with-parts': hasParts,
            'card--step': step,
        }"
    >
        <div
            v-if="hasParts"
            class="card__header"
        >
            <slot name="header">
                <div class="card__header__title">
                    <slot
                        v-if="hasTitleSlot"
                        name="title"
                    />
                    <span v-if="title">{{ title }}</span>
                </div>
            </slot>
        </div>

        <div :class="hasParts ? 'card__content' : ''">
            <slot />
        </div>

        <div
            v-if="$slots.side"
            class="card__side"
        >
            <slot name="side" />
        </div>
    </Component>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        fit?: boolean,
        center?: boolean,
        tag?: string,
        step?: boolean
        title?: string
    }>(), {
        tag: 'div',
        step: null,
        title: null,
    })

    const hasTitleSlot = 'title' in useSlots()
    const hasHeaderSlot = 'header' in useSlots()

    const hasParts = hasHeaderSlot || hasTitleSlot || props.title
</script>
