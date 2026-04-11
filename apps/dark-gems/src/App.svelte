<script lang="ts">
  import { onMount } from 'svelte';
  import Grid from './components/Grid.svelte';
  import BalanceDisplay from './components/BalanceDisplay.svelte';
  import BetControls from './components/BetControls.svelte';
  import FreeSpinsOverlay from './components/FreeSpinsOverlay.svelte';
  import ErrorModal from './components/ErrorModal.svelte';
  import { gameActor } from './stores/game-store';

  onMount(() => {
    gameActor.start();
  });
</script>

<main class="game-root">
  <div class="game-viewport">
    <FreeSpinsOverlay />
    <Grid />
  </div>
  <BalanceDisplay />
  <BetControls />
  <ErrorModal />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0a1e;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
  }
  .game-root {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    max-width: 960px;
    margin: 0 auto;
  }
  .game-viewport {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
