// bookingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id:null,
    date: null,
    time: null,
    table: null,
    preOrderItems: [],
    totalAmount: 0,
    orderId:null,
    selectedVoucher: null, 
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingInfo: (state, action) => {
            return { ...state, ...action.payload };
        },
        setSelectedVoucher: (state, action) => {
            state.selectedVoucher = action.payload;
        },
        setCartItems: (state, action) => {
            state.preOrderItems = action.payload.selectedItems;
            state.totalAmount = action.payload.total;
        },
        clearBookingInfo: (state) => {
            return initialState;
        },
    },
});

export const { setBookingInfo,setSelectedVoucher, clearBookingInfo,setCartItems, } = bookingSlice.actions;
export default bookingSlice.reducer;