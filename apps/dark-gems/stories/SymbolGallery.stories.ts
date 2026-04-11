import type { Meta, StoryObj } from '@storybook/svelte-vite';
import SymbolGallery from './SymbolGallery.svelte';

const meta: Meta<SymbolGallery> = {
  title: 'Dark Gems/Symbol Gallery',
  component: SymbolGallery,
};

export default meta;
type Story = StoryObj<SymbolGallery>;

export const AllSymbols: Story = {};
