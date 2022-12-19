<template>
    <div
        v-click-outside="close"
        class="context-menu"
        tabindex="-1"
    >
        <slot :options="options">
            <button
                v-for="(option, $i) in options"
                :key="$i"
                type="button"
                class="context-menu__item"
                :class="option.class"
                @click="handleClick(option)"
            >
                <span
                    v-if="option.icon"
                    class="context-menu__item__icon"
                >
                    <Icon
                        :icon="option.icon"
                        class="context-menu__item__icon__element"
                    />
                </span>
                <span class="context-menu__item__text">
                    {{ option.text }}
                </span>
            </button>
        </slot>
    </div>
</template>

<script setup lang="ts">
    import { vOnClickOutside } from '@vueuse/components'
    import { ContextMenuOption } from "~/components/ContextMenu/ContextMenu.d"
    import { Icon } from "#components"

    const props = withDefaults(defineProps<{
        options: Array<ContextMenuOption>,
        clickOutside?: boolean,
    }>(), {
        clickOutside: false,
    })

    const vClickOutside = props.clickOutside ? vOnClickOutside : {}

    const emit = defineEmits(['close'])

    const close = () => {
        emit('close')
    }

    const handleClick = (option) => {
        option.onClick ? option.onClick() : {}

        if (! option.keep) {
            close()
        }
    }
</script>
