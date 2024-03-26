module.exports = {
  plugins: ["@typescript-eslint/eslint-plugin", "prettier", "import", "promise"],
  extends: [
    "eslint:recommended", 
    "prettier",
    "standard-with-typescript", 
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",  
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended"
  ],    
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/semi": "off", 
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/comma-spacing": "error",
    "@typescript-eslint/return-await": "error",  
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unused-expressions": "warn",
    "import/no-unresolved": "error",
    "no-unused-vars": "off",
    "no-unused-expressions": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off"
  }, 
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/extensions": [
      ".ts",
      ".tsx"
    ],
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
};