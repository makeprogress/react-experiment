module.exports = {
  stories: [
    '../stories/**/*',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: async config => config,
}
