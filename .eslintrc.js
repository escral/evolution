module.exports = {
    root: true,

    env: {
        node: true,
    },

    rules: {
        "vue/no-v-html": ["off"],
    },

    extends: [
        "@escral/eslint-config-vue-typescript",
    ],
}
