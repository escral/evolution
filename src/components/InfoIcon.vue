<template>
    <div v-if="text" v-tooltip="{ content: `<div class='text-sm max-w-md'>${text}</div>` }" class="text-gray-300">
        <Icon icon="fa-regular fa-circle-question" />
    </div>
</template>

<script>
    export default {
        name: "InfoIcon",

        props: {
            text: {
                type: String,
                default: '',
            },
        },
    }
</script>
