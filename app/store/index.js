// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import bookingReducer from './bookingSlice'
import notificationReducer from './NotificationSlice'
<<<<<<< HEAD
<<<<<<< HEAD
import reservationReducer from './reservationSlice'
=======
>>>>>>> 6000bf52a6a2d0434648b3bf85923289798ca205
=======
>>>>>>> 6000bf52a6a2d0434648b3bf85923289798ca205
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
<<<<<<< HEAD
<<<<<<< HEAD
        notifications:notificationReducer,
        reservation: reservationReducer,

=======
        notifications:notificationReducer
>>>>>>> 6000bf52a6a2d0434648b3bf85923289798ca205
=======
        notifications:notificationReducer
>>>>>>> 6000bf52a6a2d0434648b3bf85923289798ca205
    },
    preloadedState: loadState(),
});

// Lắng nghe thay đổi trạng thái và lưu vào localStorage
store.subscribe(() => {
    saveState(store.getState());
});

export default store;
