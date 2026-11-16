<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title class="page-title">Crypto Watchlist</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="query"
          :debounce="200"
          placeholder="Cari nama atau simbol koin"
          class="search"
        />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <!-- Skeleton loader -->
      <div v-if="isLoading" class="list">
        <div v-for="n in 8" :key="n" class="skeleton-row">
          <ion-skeleton-text animated class="sk-rank" />
          <div class="sk-mid">
            <ion-skeleton-text animated style="width: 50px; height: 14px" />
            <ion-skeleton-text animated style="width: 90px; height: 11px" />
          </div>
          <div class="sk-end">
            <ion-skeleton-text animated style="width: 70px; height: 14px" />
            <ion-skeleton-text animated style="width: 52px; height: 16px" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state">
        <p>{{ error }}</p>
        <ion-button size="small" @click="() => refetch()">Coba lagi</ion-button>
      </div>

      <!-- Kosong -->
      <div v-else-if="!filtered.length" class="state">
        <p>Tidak ada koin yang cocok dengan “{{ query }}”.</p>
      </div>

      <!-- List -->
      <ion-list v-else class="list" lines="none">
        <CryptoItem v-for="coin in filtered" :key="coin.id" :coin="coin" />
      </ion-list>

      <!-- Muat lebih banyak -->
      <div v-if="!isLoading && !error && coins.length" class="load-more">
        <ion-button
          expand="block"
          size="small"
          fill="outline"
          :disabled="!hasNextPage || isFetchingNextPage"
          @click="() => fetchNextPage()"
        >
          <ion-spinner v-if="isFetchingNextPage" name="crescent" class="btn-spinner" />
          <span v-else>{{ hasNextPage ? 'Muat lebih banyak' : 'Semua data dimuat' }}</span>
        </ion-button>
        <p class="loaded-info">Dimuat {{ coins.length }} dari {{ totalCoins }} koin</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonRefresher, IonRefresherContent, IonSkeletonText, IonButton,
  IonSpinner,
} from '@ionic/vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import CryptoItem from '@/components/CryptoItem.vue';
import type { Coin } from '@/types/coin';

const http = inject<AxiosInstance>('http')!;

const pageSize = 20;
const query = ref('');

interface TickersResponse {
  data: Coin[];
  info: { coins_num: number; time: number };
}

const {
  data,
  isLoading,
  isFetching,
  isFetchingNextPage,
  error: queryError,
  fetchNextPage,
  hasNextPage,
  refetch,
} = useInfiniteQuery({
  queryKey: ['coins'],
  queryFn: async ({ pageParam }) => {
    const { data: res } = await http.get<TickersResponse>(
      `/tickers/?start=${pageParam}&limit=${pageSize}`,
    );
    return res;
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => {
    const loaded = allPages.reduce((acc, p) => acc + (p.data?.length ?? 0), 0);
    const total = lastPage.info?.coins_num ?? 0;
    if (loaded >= total || (lastPage.data?.length ?? 0) < pageSize) return undefined;
    return loaded;
  },
});

const coins = computed<Coin[]>(() => data.value?.pages.flatMap((p) => p.data ?? []) ?? []);
const totalCoins = computed(() => data.value?.pages[data.value.pages.length - 1]?.info?.coins_num ?? 0);

const filtered = computed(() => {
  const q = (query.value ?? '').trim().toLowerCase();
  if (!q) return coins.value;
  return coins.value.filter(
    (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
  );
});

const error = computed(() =>
  queryError.value
    ? 'Gagal memuat data. Periksa koneksi internet Anda.'
    : '',
);

async function onRefresh(event: CustomEvent) {
  await refetch();
  (event.target as HTMLIonRefresherElement).complete();
}
</script>

<style scoped>
ion-toolbar {
  --background: var(--app-bg);
  --border-width: 0;
}
.page-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.search {
  --background: var(--app-card);
  --border-radius: 10px;
  --placeholder-color: var(--app-muted);
  --icon-color: var(--app-muted);
  padding: 0 8px 8px;
}
ion-content {
  --background: var(--app-bg);
}
.list {
  background: transparent;
  padding: 8px 0 24px;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 68px;
  margin: 0 12px 8px;
  padding: 0 14px;
  background: var(--app-card);
  border: 1px solid var(--app-border);
  border-radius: 12px;
}
.sk-rank { width: 30px; height: 30px; margin: 0; border-radius: 8px; }
.sk-mid, .sk-end { display: flex; flex-direction: column; gap: 6px; }
.sk-mid { flex: 1; }
.sk-end { align-items: flex-end; }
.state {
  padding: 64px 24px;
  text-align: center;
  color: var(--app-muted);
}
.load-more {
  margin: 0 12px 8px;
  padding: 12px 14px;
  background: var(--app-card);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.load-more ion-button {
  --border-radius: 12px;
  --border-color: var(--app-border);
  --color: var(--app-text);
  width: 100%;
}
.loaded-info {
  margin: 0;
  font-size: 12px;
  color: var(--app-muted);
  font-variant-numeric: tabular-nums;
}
.btn-spinner {
  width: 16px;
  height: 16px;
}
</style>
