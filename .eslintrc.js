module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:jsdoc/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    es2021: true,
    node: true,
  },
  rules: {
    semi: [1, "always"],
    "no-unused-vars": [0],
    "jsdoc/require-returns": [0],
    "jsdoc/require-param-description": [0],
    "jsdoc/require-returns-description": [0],
    "jsdoc/require-param-type": [1],
    "jsdoc/no-undefined-types": [2],
    "no-process-exit": [0],
    "no-irregular-whitespace": [0],
    "node/no-unsupported-features": [0],
    "no-inner-declarations": [1],
    "no-useless-escape": [1],
    "no-empty": [2],
    "no-constant-condition": [0],
  },
};
