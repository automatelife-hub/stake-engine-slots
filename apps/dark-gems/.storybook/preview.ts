import type { Preview } from '@storybook/svelte-vite';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a1e' }],
    },
  },
};

export default preview;
