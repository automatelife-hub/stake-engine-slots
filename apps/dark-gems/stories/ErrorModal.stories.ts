import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ErrorModal from '../src/components/ErrorModal.svelte';

const meta: Meta<ErrorModal> = {
  title: 'Dark Gems/Error Modal',
  component: ErrorModal,
};

export default meta;
type Story = StoryObj<ErrorModal>;

export const Default: Story = {};
