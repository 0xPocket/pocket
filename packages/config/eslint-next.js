module.exports = {
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["next", "prettier", "plugin:@typescript-eslint/recommended"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/ban-types": [
      "warn",
      {
        types: {
          "{}": false,
        },
      },
    ],
  },
};
