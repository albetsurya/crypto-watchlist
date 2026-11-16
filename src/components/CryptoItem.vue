<template>
  <ion-item lines="none" class="coin-item" :detail="false">
    <div class="rank">{{ coin.rank }}</div>

    <ion-label>
      <h2 class="symbol">{{ coin.symbol }}</h2>
      <p class="name">{{ coin.name }}</p>
    </ion-label>

    <div slot="end" class="quote">
      <span class="price">{{ price }}</span>
      <span class="ticker" :class="isUp ? 'up' : 'down'">
        {{ isUp ? '▲' : '▼' }} {{ Math.abs(change).toFixed(2) }}%
      </span>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonItem, IonLabel } from '@ionic/vue';
import type { Coin } from '@/types/coin';

const props = defineProps<{ coin: Coin }>();

const price = computed(() => {
  const value = Number(props.coin.price_usd);
  // Koin murah butuh lebih banyak desimal agar harga tetap terbaca
  const digits = value >= 1 ? 2 : 6;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
});

const change = computed(() => Number(props.coin.percent_change_24h) || 0);
const isUp = computed(() => change.value >= 0);
</script>

<style scoped>
.coin-item {
  --padding-start: 14px;
  --inner-padding-end: 14px;
  --min-height: 68px;
  --background: var(--app-card);
  margin: 0 12px 8px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
}
.rank {
  min-width: 30px;
  height: 30px;
  margin-right: 12px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--app-border);
  color: var(--app-muted);
  font-size: 12px;
  font-weight: 600;
}
.symbol {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text);
}
.name {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--app-muted);
}
.quote {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}
.price {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--app-text);
}
.ticker {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ticker.up {
  color: var(--app-up);
  background: rgba(0, 200, 83, 0.14);
}
.ticker.down {
  color: var(--app-down);
  background: rgba(255, 82, 82, 0.14);
}
</style>
