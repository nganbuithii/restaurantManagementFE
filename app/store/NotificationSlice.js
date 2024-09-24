import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API, { authApi, endpoints } from '@/app/configs/API';

export const fetchUnreadNotificationsCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState(); 
            const token = state.auth.token;
            const response = await authApi(token).get(endpoints.getunRead);
            console.log('Unread Count API Response:', response.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;
            const response = await authApi(token).get(endpoints.getNofi);
            console.log('Notifications API Response:', response.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        unreadCount: 0,
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnreadNotificationsCount.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUnreadNotificationsCount.fulfilled, (state, action) => {
                console.log('Unread Count Fulfilled Payload:', action.payload);
                state.unreadCount = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUnreadNotificationsCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                console.log('Notifications Fulfilled Payload:', action.payload);
                state.notifications = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default notificationSlice.reducer;