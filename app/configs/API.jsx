import axios from 'axios';

const HOST = "http://localhost:3005";

export const endpoints = {
    'login': '/api/auth/login',
    'currentUser':'/api/me',
    'register':'/api/auth/register',
    'forgetPassword':'/api/auth/forgot-password',
    'resetPassword':'/api/auth/reset-password',
    'getAllUser':'/api/users',
    'getUserById':(id) => `/api/users/${id}`,
    'getNewUser':'/api/users/new-customers',
    'uploadAVT':'/api/users/upload-avt',
    'getAllDishes':'/api/menu-item',
    'getAllFeedbacks':'/api/feedbacks',
    'replyFeedback':(id) => `/apifeedbacks/${id}/reply`,
    'getAllMenus':'/api/menu',
    'getMenuById':(id) => `/api/menu/${id}`,
    'getAllInventory':'/api/inventory',
    'getIngredientById': (id) => `/api/ingredient/${id}`,
    'getAllOrders':'/api/orders',
    'getOrderById':(id) => `/api/orders/${id}`,
    'statisticOrder':'/api/orders/statistics',
    'getAllSlips':'/api/warehouse-slips',
    'getSlipById':(id) => `/api/warehouse-slips/${id}`,
    'getAllVouchers':'/api/vouchers',
    'getAllPermission':'/api/permission',
    'getAllReservations':'/api/reversations',
    'getReservationByMe':'/api/reversations/me',
    'changeStatusReser':(id) => `/api/reversations/${id}/change-status`,
    'getReservationById':(id) =>`/api/reversations/${id}`,
    'getTables':'/api/table',
    'getAllSupliers':'/api/suppliers',
    'getAllIngredients':'/api/ingredient',
    'getInById':(id) => `/api/ingredient/${id}`,
    'getAllRoles':'/api/role',
    'getRoleById':(id) => `/api/role/${id}`,
    'changeStatusRole':(id) => `/api/role/${id}/status`,
    'getUserById':(id) => `/api/users/${id}`,
    'createIngredient':'/api/ingredient',
    'getDisheById':(id) => `/api/menu-item/${id}`,
    'getVoucherById':(id) => `/api/vouchers/${id}`,
    'getAllPer':'/api/permission/all',
    'changeStatusVoucher':(id) => `/api/vouchers/${id}/change-status`,
    'getFBById':(id) => `/api/feedbacks/${id}`,
    'getSupplierById':(id) => `/api/suppliers/${id}`,
    'statisticInventory':'/api/warehouse-slips/statistics',
    'changeStatusOrder':(id) => `/api/orders/${id}/change-status`,
    'chat':"/api/chat",
    'statisticRevenue':"/api/orders/revenue-statistics",
    'get_vnpay':'/api/payment/create_payment_url',
    'vnpay_return':'/api/payment/vnpay_data',
    'order-history':'/api/orders/me',
    'statisticFeedback':'/api/feedbacks/statistics',
    'getunRead':'/api/notifications/unread-count',
    'getNofi':'/api/notifications',
    'googleLogin':'/api/auth/google',
    'table_available':'/api/table/available'
}

export const authApi = (accessToken) =>
    axios.create({
        baseURL: HOST,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

export default axios.create({
    baseURL: HOST,
});