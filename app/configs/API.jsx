import axios from 'axios';

const HOST = "http://localhost:3005";

export const endpoints = {
    'login': '/auth/login',
    'currentUser':'/me',
    'register':'/auth/register',
    'forgetPassword':'/auth/forgot-password',
    'resetPassword':'/auth/reset-password',
    'getAllUser':'/users',
    'getAllDishes':'/menu-item',
    'getAllFeedbacks':'/feedbacks',
    'getAllMenus':'/menu',
    'getAllInventory':'/inventory',
    'getIngredientById': (id) => `/ingredient/${id}`

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