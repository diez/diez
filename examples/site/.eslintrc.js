module.exports = {
  root: true,
  extends: [
    'plugin:vue-libs/recommended'
  ],
  rules: {
    indent: ['error', 2, { MemberExpression: 'off' }],
    'no-undef': ['error'],
    'semi': ['error', 'always'],
    'operator-linebreak': ['error', 'before']
  }
}
