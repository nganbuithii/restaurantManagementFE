import axios from 'axios';

const HOST = "http://localhost:3005";

export const endpoints = {
    'login': '/auth/login',
    'currentUser':'/me',
    'register':'/auth/register',
    'forgetPassword':'/auth/forgot-password',
    'resetPassword':'/auth/reset-password',
    'getAllUser':'/users',
    'getUserById':(id) => `/users/${id}`,
    'uploadAVT':'/users/upload-avt',
    'getAllDishes':'/menu-item',
    'getAllFeedbacks':'/feedbacks',
    'getAllMenus':'/menu',
    'getMenuById':(id) => `/menu/${id}`,
    'getAllInventory':'/inventory',
    'getIngredientById': (id) => `/ingredient/${id}`,
    'getAllOrders':'/orders',
    'getOrderById':(id) => `/orders/${id}`,
    'getAllSlips':'/warehouse-slips',
    'getSlipById':(id) => `/warehouse-slips/${id}`,
    'getAllVouchers':'/vouchers',
    'getAllPermission':'/permission',
    'getAllReservations':'/reversations',
    'changeStatusReser':(id) => `/reversations/${id}/change-status`,
    'getTables':'/table',
    'getAllSupliers':'/suppliers',
    'getAllIngredients':'/ingredient',
    'getInById':(id) => `/ingredient/${id}`,
    'getAllRoles':'/role',
    'getUserById':(id) => `/users/${id}`,
    'createIngredient':'/ingredient',
    'getDisheById':(id) => `/menu-item/${id}`,
    'getVoucherById':(id) => `/vouchers/${id}`,
    'changeStatusVoucher':(id) => `/vouchers/${id}/change-status`,
    'getFBById':(id) => `/feedbacks/${id}`,
    'getSupplierById':(id) => `/suppliers/${id}`,
    'statisticInventory':'/warehouse-slips/statistics',
    'changeStatusOrder':(id) => `/orders/${id}/change-status`
}

// Tạo một phiên bản axios với các cài đặt đã được cung cấp
export const authApi = (accessToken) =>
    axios.create({
        baseURL: HOST,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

// Xuất một phiên bản axios với cài đặt mặc định
export default axios.create({
    baseURL: HOST,
});