// @ts-check

import baseConfig from "../eslint.config.js";

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        global: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow any in backend for flexibility
    },
  },
];
