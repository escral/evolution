<template>
    <Component
        :is="_tag"
        class="button"
        :class="{
            'button--large': large,
            'button--small': small,
            'button--ghost': ghost,
            'button--dashed': dashed,
            'button--text': text,
        }"
        v-bind="nativeAttrs"
    >
        <slot />
    </Component>
</template>

<script setup>
    const props = defineProps({
        tag: {
            type: String,
            default: 'button',
        },
        isLink: {
            type: Boolean,
            default: false,
        },
        large: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
        ghost: {
            type: Boolean,
            default: false,
        },
        dashed: {
            type: Boolean,
            default: false,
        },
        text: {
            type: Boolean,
            default: false,
        },

        // Link attrs
        href: {
            type: String,
            default: null,
        },

        // Button attrs
        type: {
            type: String,
            default: 'button',
        },
    })

    const _tag = computed(() => {
        if (props.isLink) {
            return resolveComponent('NuxtLink')
        }

        return props.tag
    })

    const checkRequiredAttributes = (attrs) => {
        attrs.forEach((attr) => {
            if (props[attr] === undefined) {
                console.error(`Missing required attribute: ${attr}`, useCurrentElement().value)
            }
        })
    }

    const nativeAttrs = computed(() => {
        if (_tag.value === 'a') {
            checkRequiredAttributes(['href'])

            return {
                href: props.href,
            }
        } else if (_tag.value === 'button') {
            return {
                'aria-label': props.ariaLabel,
                type: props.type,
            }
        }

        return {}
    })
</script>
