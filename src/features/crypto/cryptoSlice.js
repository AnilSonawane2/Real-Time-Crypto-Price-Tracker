import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [],
  filteredAssets: [],
  loading: false,
  error: null,
  sortConfig: {
    key: 'rank',
    direction: 'ascending',
  },
  filters: {
    searchTerm: '',
    priceRange: [0, 100000],
    marketCapRange: [0, 1000000000000],
  },
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setAssets: (state, action) => {
      state.assets = action.payload;
      state.filteredAssets = applyFiltersAndSorting(action.payload, state.filters, state.sortConfig);
      state.loading = false;
    },
    updateAsset: (state, action) => {
      const { id, updates } = action.payload;
      const assetIndex = state.assets.findIndex(asset => asset.id === id);
      if (assetIndex !== -1) {
        state.assets[assetIndex] = { ...state.assets[assetIndex], ...updates };
        state.filteredAssets = applyFiltersAndSorting(state.assets, state.filters, state.sortConfig);
      }
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
      state.filteredAssets = applyFiltersAndSorting(state.assets, state.filters, action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredAssets = applyFiltersAndSorting(state.assets, { ...state.filters, ...action.payload }, state.sortConfig);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredAssets = applyFiltersAndSorting(state.assets, initialState.filters, state.sortConfig);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Helper function for filtering and sorting
const applyFiltersAndSorting = (assets, filters, sortConfig) => {
  // Apply filters
  let filtered = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                         asset.symbol.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesPrice = asset.price >= filters.priceRange[0] && asset.price <= filters.priceRange[1];
    const matchesMarketCap = asset.marketCap >= filters.marketCapRange[0] && 
                            asset.marketCap <= filters.marketCapRange[1];
    return matchesSearch && matchesPrice && matchesMarketCap;
  });

  // Apply sorting
  if (sortConfig.key) {
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  return filtered;
};

export const { 
  setAssets, 
  updateAsset, 
  setSortConfig, 
  setFilters, 
  resetFilters,
  setLoading, 
  setError 
} = cryptoSlice.actions;

export const selectAllAssets = (state) => state.crypto.assets;
export const selectFilteredAssets = (state) => state.crypto.filteredAssets;
export const selectLoadingStatus = (state) => state.crypto.loading;
export const selectError = (state) => state.crypto.error;
export const selectSortConfig = (state) => state.crypto.sortConfig;
export const selectFilters = (state) => state.crypto.filters;

export default cryptoSlice.reducer;