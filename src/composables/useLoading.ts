import type { ComputedRef } from 'vue';

export interface UseLoadingReturn {
  startLoading: () => void
  stopLoading: () => void
  isLoading: ComputedRef<boolean>
}
const state = reactive({
  globalLoadingCount: 0,
});

export function useGlobalLoading(): UseLoadingReturn {
  const isLoading = computed(() => state.globalLoadingCount > 0);

  const startLoading = () => {
    state.globalLoadingCount += 1;
  };
  const stopLoading = () => {
    if (state.globalLoadingCount > 0)
      state.globalLoadingCount -= 1;
  };

  return {
    startLoading,
    stopLoading,
    isLoading,
  };
}

export function useLoading(): UseLoadingReturn {
  const loadingCount = ref(0);
  const isLoading = computed(() => loadingCount.value > 0);

  const startLoading = () => {
    loadingCount.value += 1;
  };
  const stopLoading = () => {
    if (loadingCount.value > 0)
      loadingCount.value -= 1;
  };

  return {
    startLoading,
    stopLoading,
    isLoading,
  };
}
