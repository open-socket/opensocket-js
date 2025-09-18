module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'testing-utils',
        'provider-pusher',
        'provider-ably',
        'provider-socketio',
        'react',
        'vue',
        'angular',
        'deps',
        'release',
        'ci'
      ]
    ]
  }
};