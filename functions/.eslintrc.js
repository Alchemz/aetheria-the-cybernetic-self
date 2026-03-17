module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        "ecmaVersion": 2018,
    },
    extends: [
        "eslint:recommended",
        "google",
    ],
    rules: {
        "no-restricted-globals": ["error", "name", "length"],
        "prefer-arrow-callback": "error",
        "quotes": ["error", "double", { "allowTemplateLiterals": true }],
        "max-len": ["error", { "code": 120 }],
        "object-curly-spacing": ["off"],
        "comma-dangle": ["off"],
        "indent": ["off"],
        "require-jsdoc": 0,
        "valid-jsdoc": 0,
        "eol-last": 0,
        "no-trailing-spaces": 0,
        "no-empty": 0,
        "new-cap": 0
    },
    overrides: [
        {
            files: ["**/*.spec.*"],
            env: {
                mocha: true,
            },
            rules: {},
        },
    ],
    globals: {},
};
