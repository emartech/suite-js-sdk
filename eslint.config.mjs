import eslint from "@eslint/js";
import chaiFriendly from "eslint-plugin-chai-friendly";
import noOnlyTests from "eslint-plugin-no-only-tests";
import security from "eslint-plugin-security";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig({
  extends: [
    eslint.configs.recommended,
    chaiFriendly.configs.recommendedFlat,
    security.configs.recommended,
  ],
  languageOptions: {
    ecmaVersion: 2023,
    globals: {
      ...globals.node,
      ...globals.mocha,
      ...globals.chai,
      sinon: "readonly",
    },
  },
  plugins: {
    "no-only-tests": noOnlyTests,
  },
  rules: {
    "no-only-tests/no-only-tests": "error",
    "security/detect-object-injection": "off",
  },
});
