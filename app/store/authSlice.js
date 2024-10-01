import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    permissions: [], 
    cartTotalItems: 0,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.permissions = action.payload.permissions || [];
            state.cartTotalItems = action.payload.totalItems || 0; 
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.permissions = [];
            state.cartTotalItems = 0;
        },
        updateUser(state, action) {
            state.user = {
                ...state.user,
                ...action.payload,
            };
        },
        updateRolePermissions(state, action) {
            const updatedPermissions = action.payload.permissions;  
            state.permissions = updatedPermissions;
        },
        updateCartTotalItems(state, action) {
            state.cartTotalItems = action.payload;
        },
    },
});

export const { 
    loginSuccess, 
    logout, 
    updateUser, 
    updateRolePermissions, 
    updateCartTotalItems 
} = authSlice.actions;

export default authSlice.reducer;