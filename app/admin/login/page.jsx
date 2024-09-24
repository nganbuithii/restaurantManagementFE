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
import Loading from '@/components/Loading'

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await API.post(endpoints.login, {
                // username: "admin22",
                // password: "12345678"
                username: username,
                password: password
            });
            const token = response.data.data.accessToken;


            const userResponse = await authApi(token).get(endpoints.currentUser);
            console.log("DATAAAAAAA", userResponse.data);
            console.log("ROLE", userResponse.data.data.roleName)
            const user = userResponse.data.data;
            const roleId = userResponse.data.data.roleId;
            const roleResponse = await authApi(token).get(endpoints.getRoleById(roleId));
            const dataPermission = roleResponse.data.data.permissions;
            if (userResponse.data.data.roleName === 'CUSTOMER') {
                console.log("Chặn");
                setIsLoading(false);

                toast.error('You do not have permission to access the admin page', { containerId: 'A' });
                return;
            }


            Cookies.set('token', token, { expires: 30 }); 
            dispatch(loginSuccess({
                user: userResponse.data.data,
                token: token,
                permissions: dataPermission 
            }));

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials.');
        }
    };
    if (isLoading) {
        return <Loading />;
    }
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
            <ToastContainer position="top-right" autoClose={3000} containerId={'A'} />
        </div>
    );
}