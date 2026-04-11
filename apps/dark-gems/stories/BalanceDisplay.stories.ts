import type { Meta, StoryObj } from '@storybook/svelte-vite';
import BalanceDisplay from '../src/components/BalanceDisplay.svelte';

const meta: Meta<BalanceDisplay> = {
  title: 'Dark Gems/Balance Display',
  component: BalanceDisplay,
};

export default meta;
type Story = StoryObj<BalanceDisplay>;

export const Default: Story = {};
