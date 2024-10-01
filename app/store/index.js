// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import bookingReducer from './bookingSlice'
import notificationReducer from './NotificationSlice'
import reservationReducer from './reservationSlice'
import voucherReducer from './voucherSlice'
import cartReducer from './cartSlice';
// Lấy trạng thái từ localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

// Lưu trạng thái vào localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('authState', serializedState);
    } catch (err) {
        // Handle errors here
    }
};

const store = configureStore({
    reducer: {
        auth: authReducer,
        booking:bookingReducer,
        notifications:notificationReducer,
        reservation: reservationReducer,
        vouchers: voucherReducer,
        cart:  cartReducer
    },
    preloadedState: loadState(),
});

// Lắng nghe thay đổi trạng thái và lưu vào localStorage
store.subscribe(() => {
    saveState(store.getState());
});

export default store;
