module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        node: true,
        es2020: true,
    },
    plugins: ["@typescript-eslint", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "never"],
        indent: ["error", 4],
        
        "import/order": [
            "error",
            {
                groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
                "newlines-between": "always"
            }
        ],
        
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/explicit-module-boundary-types": "off"
    }
}
