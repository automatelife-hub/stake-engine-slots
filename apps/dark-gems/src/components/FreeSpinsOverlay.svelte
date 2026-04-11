<script lang="ts">
  import { freeSpinsRemaining, mode, send } from '../stores/game-store';
</script>

{#if $mode === 'freespin' || $freeSpinsRemaining > 0}
  <div class="overlay">
    <div class="counter">
      <span class="label">Free Spins</span>
      <span class="remaining">{$freeSpinsRemaining}</span>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    display: flex;
    justify-content: center;
    padding-top: 8px;
    z-index: 10;
  }
  .counter {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #ffd700;
    border-radius: 12px;
    padding: 8px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .label {
    font-size: 12px;
    color: #ffd700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .remaining {
    font-size: 36px;
    font-weight: 900;
    color: #fff;
  }
</style>
