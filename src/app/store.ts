import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/shared/api/authApi';
import { statsApi } from '@/shared/api/statsApi';
import { supportApi } from '@/shared/api/supportApi';
import { leadApi } from '@/shared/api/leadApi';
import { reviewApi } from '@/shared/api/reviewsApi';
import { bannersApi } from '@/shared/api/bannersApi';
import { announcementApi } from '@/shared/api/announcementsApi';

export const store = configureStore({
    reducer: {
        [statsApi.reducerPath]: statsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [supportApi.reducerPath]: supportApi.reducer,
        [leadApi.reducerPath]: leadApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [bannersApi.reducerPath]: bannersApi.reducer,
        [announcementApi.reducerPath]: announcementApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(statsApi.middleware)
            .concat(authApi.middleware)
            .concat(supportApi.middleware)
            .concat(leadApi.middleware)
            .concat(reviewApi.middleware)
            .concat(bannersApi.middleware)
            .concat(announcementApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
