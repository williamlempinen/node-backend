import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "no-unused-vars": 1,
      "no-undef": 1,
    },
  },
];
