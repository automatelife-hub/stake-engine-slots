<script lang="ts">
  import { balance, betAmount } from '../stores/game-store';

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
</script>

<div class="balance-bar">
  <div class="balance-item">
    <span class="label">Balance</span>
    <span class="value">{formatCurrency($balance)}</span>
  </div>
  <div class="balance-item">
    <span class="label">Bet</span>
    <span class="value">{formatCurrency($betAmount)}</span>
  </div>
</div>

<style>
  .balance-bar {
    display: flex;
    justify-content: space-between;
    padding: 8px 24px;
    background: rgba(10, 10, 30, 0.85);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .balance-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .value {
    font-size: 20px;
    font-weight: 700;
    color: #ffd700;
  }
</style>
