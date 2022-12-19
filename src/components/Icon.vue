<script setup lang="ts">
    import type { Component } from "vue"

    withDefaults(defineProps<{
        tag?: string | Component,
        icon: string | [string] | object
    }>(), {
        tag: 'i',
    })
</script>

<script lang="ts">
    export default {
        render() {
            return h(this.tag, {
                class: this.icon,
            })
        },
    }
</script>

