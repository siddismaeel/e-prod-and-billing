import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';

// Configure Redux store with Redux Toolkit
// Redux Toolkit includes Thunk middleware by default
export const store = configureStore({
  reducer: {
    example: exampleReducer,
    // Add more reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

// TypeScript types (if using TypeScript, uncomment these)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

