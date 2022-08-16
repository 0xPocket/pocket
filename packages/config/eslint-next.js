module.exports = {
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["next", "prettier", "plugin:@typescript-eslint/recommended"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "@next/next/no-img-element": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
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
