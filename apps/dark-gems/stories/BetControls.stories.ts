import type { Meta, StoryObj } from '@storybook/svelte-vite';
import BetControls from '../src/components/BetControls.svelte';

const meta: Meta<BetControls> = {
  title: 'Dark Gems/Bet Controls',
  component: BetControls,
};

export default meta;
type Story = StoryObj<BetControls>;

export const Default: Story = {};
