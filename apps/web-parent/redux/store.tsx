import { configureStore } from '@reduxjs/toolkit';
import { pocketApi } from './apiSlice';
import childrenReducer from './children/childrenSlice';

export const store = configureStore({
  reducer: {
    [pocketApi.reducerPath]: pocketApi.reducer,
    children: childrenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pocketApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
