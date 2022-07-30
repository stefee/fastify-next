/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  reportUnusedDisableDirectives: true,
  rules: {
    "@typescript-eslint/require-await": "off",
  },
  overrides: [
    {
      files: ["*.spec.*", "*.test.*"],
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
      rules: {
        "@typescript-eslint/unbound-method": "off",
        "jest/unbound-method": "error",
      },
    },
  ],
};
