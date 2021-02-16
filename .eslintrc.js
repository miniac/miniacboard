module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:prettier/recommended",
    "prettier/react",
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "no-use-before-define": "warn",
    "no-param-reassign": "warn",
    "no-underscore-dangle": "off",
    "no-unused-vars": "warn",
    "import/no-named-as-default": "off",
  },
};
