'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const onSubmit = async () => {
        // Xử lý logic gửi biểu mẫu ở đây
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: 'url("/images/register.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-11 bg-white bg-opacity-25 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">REGISTER ACCOUNT</h2>

                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 mb-2">FullName</label>
                    <input
                        id="fullName"
                        {...register('fullName', { required: 'Họ và tên không được để trống' })}
                        className="border border-gray-300 p-3 w-full rounded text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {/* {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>} */}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        id="email"
                        {...register('email', { required: 'Email không được để trống' })}
                        className="border border-gray-300 p-3 w-full rounded text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {/* {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>} */}
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                    <input
                        id="username"
                        {...register('username', { required: 'username không được để trống' })}
                        className="border border-gray-300 p-3 w-full rounded text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {/* {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>} */}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                    <input
                        id="password"
                        {...register('password', { required: 'Mật khẩu không được để trống' })}
                        type="password"
                        className="border border-gray-300 p-3 w-full rounded text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    {/* {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>} */}
                </div>

                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

                <p className="text-sm text-gray-600 mt-4">
                Do you already have an account?
                {' '}
                    <Link href="/login" className=" font-bold text-pink-600 hover:text-red-600 transition duration-200">
                        Login
                    </Link>
                </p>

                <button
                    type="submit"
                    className="mt-2 bg-orange-500 text-white p-3 rounded w-full font-semibold hover:bg-orange-300 transition duration-200"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
