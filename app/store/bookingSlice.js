// bookingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    date: null,
    time: null,
    table: null,
    preOrderItems: [],
    totalAmount: 0,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingInfo: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearBookingInfo: (state) => {
            return initialState;
        },
    },
});

export const { setBookingInfo, clearBookingInfo } = bookingSlice.actions;
export default bookingSlice.reducer;