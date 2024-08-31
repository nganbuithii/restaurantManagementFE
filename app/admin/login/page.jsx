'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChefHat, Lock } from 'lucide-react';
import API, { endpoints, authApi } from '../../configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import Cookies from 'js-cookie';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        // Kiểm tra nếu đã đăng nhập, chuyển hướng đến dashboard
        const token = Cookies.get('token');
        if (token) {
            router.push('/admin/dashboard');
        }
    }, [router]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await API.post(endpoints.login, {
                username: username,
                password: password
            });    
            const token = response.data.data.accessToken;
            Cookies.set('token', token, { expires: 1 }); // Set cookie to expire in 1 day

            const userResponse = await authApi(token).get(endpoints.currentUser);
            console.log(userResponse.data);
    
            dispatch(loginSuccess({
                user: userResponse.data.data,
                token: token
            }));
    
            toast.success('Login successful!');
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 1000);
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials.');
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-orange-100 to-yellow-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <ChefHat size={48} className="text-orange-500" />
                </div>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
                <h2 className="text-xl font-semibold mb-8 text-center text-orange-500">Nabity Restaurant</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition flex items-center justify-center"
                    >
                        <Lock size={20} className="mr-2" />
                        Login
                    </button>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}