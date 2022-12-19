module.exports = {
    parserOptions: {
        "parser": "@typescript-eslint/parser",
    },

    rules: {
        "no-console": "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

        // Vue
        "vue/html-indent": ["error", 4, {"baseIndent": 1}],
        "vue/script-indent": ["error", 4, {"baseIndent": 1}],
        "vue/multi-word-component-names": "off",
        "vue/max-attributes-per-line": ["warn", {
            "singleline": 3,
            "multiline": 1,
        }],

        // Typescript
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-function": ["warn"],
        "@typescript-eslint/ban-ts-comment": ["off"],

        // General
        "semi": ["error", "never"],
        "comma-dangle": ["error", "always-multiline"],
        "object-curly-spacing": ["warn", "always", { "arraysInObjects": false }],
        "keyword-spacing": ["error"],
        "block-spacing": ["error"],
        "arrow-spacing": ["error"],
        "template-curly-spacing": ["error"],
        "computed-property-spacing": ["error", "never"],
        "key-spacing": ["error"],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "space-infix-ops": ["error"],

        // Plugins
        "import-newlines/enforce": ["error", {
            "items": 4,
            "max-len": 120,
            "semi": false,
        }],
    },

    ignorePatterns: ["/node_modules/*", "node_modules/*"],

    "extends": [
        "plugin:@typescript-eslint/recommended",
        "@vue/typescript/recommended",
        "@vue/eslint-config-typescript/recommended",
        "plugin:vue/vue3-recommended",
    ],

    plugins: [
        "@typescript-eslint",
        "import-newlines",
    ],
}
