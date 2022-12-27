module.exports = {
    root: true,

    env: {
        node: true,
    },

    rules: {
        "vue/no-v-html": ["off"],
        "@typescript-eslint/no-empty-interface": ["off"],
    },

    extends: [
        "@escral/eslint-config-vue-typescript",
    ],
}
