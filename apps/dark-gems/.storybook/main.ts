import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|svelte)'],
  framework: '@storybook/svelte-vite',
  addons: ['@storybook/addon-essentials'],
};

export default config;
