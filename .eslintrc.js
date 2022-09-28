module.exports = {
  extends: [
    '@antfu/eslint-config-vue',
  ],
  ignorePatterns: ['src/auto-imports.d.ts'],
  rules: {

    /* TYPESCRIPT */
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/consistent-type-imports': 'off',

    /* JAVASCRIPT */
    'no-console': 'off',
    'linebreak-style': ['error', 'windows'], // windows, unix
    'semi': ['error', 'always'],
    // 'curly': ['error', 'all'],
    'eslint-comments/no-unlimited-disable': 'off',

    /* VUE */

    // Priority B: Strongly Recommended (Improving Readability)
    'vue/max-attributes-per-line': ['error', {
      singleline: 2,
    }],

    // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
    'vue/attributes-order': ['error', {
      alphabetical: true,
    }],
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false,
    }],
  },
};
