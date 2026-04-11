<script lang="ts">
  import { SYMBOL_ID_MAP, type SymbolId } from '../src/game/types';

  const symbols = Object.entries(SYMBOL_ID_MAP) as [SymbolId, string][];
</script>

<div class="gallery">
  {#each symbols as [id, name]}
    <div class="symbol-card">
      <img src="/assets/symbols/{name}.svg" alt={name} width="120" height="120" />
      <div class="info">
        <span class="id">{id}</span>
        <span class="name">{name}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 24px;
  }
  .symbol-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .id {
    font-size: 14px;
    font-weight: 700;
    color: #ffd700;
  }
  .name {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: capitalize;
  }
  img {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
  }
</style>
