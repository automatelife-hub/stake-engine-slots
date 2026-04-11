<script lang="ts">
  import { canSpin, isSpinning, send } from '../stores/game-store';
</script>

<div class="controls">
  <button class="btn btn-bet" disabled={$isSpinning} onclick={() => send({ type: 'BET_DOWN' })}>
    &minus;
  </button>

  <button class="btn btn-spin" disabled={!$canSpin || $isSpinning} onclick={() => send({ type: 'SPIN' })}>
    {#if $isSpinning}
      <span class="spinner"></span>
    {:else}
      SPIN
    {/if}
  </button>

  <button class="btn btn-bet" disabled={$isSpinning} onclick={() => send({ type: 'BET_UP' })}>
    +
  </button>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 12px;
  }
  .btn {
    border: none;
    cursor: pointer;
    font-weight: 700;
    transition: transform 0.1s, opacity 0.2s;
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn:active:not(:disabled) {
    transform: scale(0.95);
  }
  .btn-bet {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 24px;
  }
  .btn-spin {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff2244, #cc1133);
    color: #fff;
    font-size: 18px;
    letter-spacing: 2px;
    box-shadow: 0 4px 20px rgba(255, 34, 68, 0.4);
  }
  .spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
