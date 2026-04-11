<script lang="ts">
  import { errorCode, send } from '../stores/game-store';

  const ERROR_MESSAGES: Record<string, string> = {
    ERR_IPB: 'Insufficient balance. Please deposit more funds to continue playing.',
    ERR_GLE: 'Gambling limit exceeded. Please play responsibly.',
    ERR_SESSION: 'Your session has expired. Please reload the game.',
    ERR_WINCAP: 'Maximum win cap reached.',
    AUTH_FAILED: 'Authentication failed. Please reload the game.',
    SPIN_FAILED: 'Spin request failed. Please try again.',
    END_ROUND_FAILED: 'Could not finalize round. Please try again.',
    FREE_SPIN_FAILED: 'Free spin failed. Please try again.',
  };
</script>

{#if $errorCode}
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Error</h3>
      <p>{ERROR_MESSAGES[$errorCode] ?? `An unexpected error occurred (${$errorCode}).`}</p>
      {#if $errorCode === 'ERR_SESSION'}
        <button onclick={() => window.location.reload()}>Reload</button>
      {:else}
        <button onclick={() => send({ type: 'DISMISS_ERROR' })}>OK</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  .modal {
    background: #1a1a2e;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 32px;
    max-width: 360px;
    text-align: center;
    color: #fff;
  }
  h3 {
    margin: 0 0 12px;
    color: #ff4466;
  }
  p {
    margin: 0 0 20px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }
  button {
    background: #ff2244;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
