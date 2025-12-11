import { statsApi } from '@/shared/api/statsApi';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        [statsApi.reducerPath]: statsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(statsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
