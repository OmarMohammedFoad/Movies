import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWatchlist,
  IWatchlistItem,
  removeFromWatchList,
  toggleWatchlist
} from "./watchlistState";

interface WatchlistState {
  items: IWatchlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
}


const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(toggleWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(toggleWatchlist.fulfilled, (state, action) => {

      state.loading = false;
      const existingIndex = state.items.findIndex(item => item.movieId === action.payload.movieId);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
    }).addCase(toggleWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    }).addCase(fetchWatchlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchWatchlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;

    }).addCase(fetchWatchlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    }).addCase(removeFromWatchList.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(removeFromWatchList.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(item => item.$id !== action.payload);
    }).addCase(removeFromWatchList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
  }
})


export default watchlistSlice.reducer;
