import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    permissions: [], 
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
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.permissions = [];
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
    },
});

export const { loginSuccess, logout, updateUser, updateRolePermissions } = authSlice.actions;
export default authSlice.reducer;
