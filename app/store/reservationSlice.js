// src/store/slices/reservationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, endpoints } from '@/app/configs/API';

export const fetchReservationDetails = createAsyncThunk(
    'reservation/fetchReservationDetails',
    async (reservationId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await authApi(token).get(endpoints.getReservationById(reservationId));
            return response.data.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const reservationSlice = createSlice({
    name: 'reservation',
    initialState: {
        details: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReservationDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservationDetails.fulfilled, (state, action) => {
                state.details = action.payload;
                state.loading = false;
            })
            .addCase(fetchReservationDetails.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default reservationSlice.reducer;
