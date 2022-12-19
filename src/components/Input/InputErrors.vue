<template>
    <div
        v-if="errors?.length"
        class="form__error"
    >
        <div
            v-for="(error, $i) in errors"
            :key="$i"
        >
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        errors?: string[],
    }>()
</script>
