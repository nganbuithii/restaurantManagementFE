"use client"; // Đánh dấu thành phần này là Client Component

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Image from 'next/image';
import { FaUser, FaLock } from 'react-icons/fa'; // Import các icon mới

export default function Login() {
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const toggleShowPassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const onSubmit = async () => {
        // Xử lý logic gửi biểu mẫu ở đây
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 relative">
                <Image
                    src="/images/login.png"  // Đã sửa đường dẫn
                    alt="Login Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                />
            </div>
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">LOGIN</h2>
                    
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <FaUser color="gray" size={20} />
                        </span>
                        <input
                            {...register('username', { required: 'Username không được để trống' })}
                            placeholder="Username"
                            className="border border-gray-300 pl-10 pr-3 py-2 w-full rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
                        />
                    </div>
                    
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <FaLock color="gray" size={20} />
                        </span>
                        <input
                            {...register('password', { required: 'Mật khẩu không được để trống' })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="border border-gray-300 pl-10 pr-3 py-2 w-full rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
                        />
                        <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? <AiFillEye color="black" size={24} /> : <AiFillEyeInvisible color="black" size={24} />}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-4 text-right font-bold">
                        <Link href="#" className="text-orange-700 hover:text-red-700 transition duration-200">
                            Forgot password?
                        </Link>
                    </p>

                    <p className="text-sm text-gray-600 mt-4">
                        Do not have an account?{' '}
                        <Link href="/register" className="font-bold text-orange-700 hover:text-red-700 transition duration-200">
                            Register
                        </Link>
                    </p>

                    <button
                        type="submit"
                        className="mt-2 bg-orange-600 text-white p-3 rounded w-full font-semibold hover:bg-orange-300 transition duration-200"
                    >
                        LOGIN
                    </button>
                    
                    <p className="text-lg font-semibold mt-4 text-gray-300 mb-3 text-center">
                        OR
                    </p>
                    
                    <div className='flex items-center justify-center mt-5 mb-3'>
                        <div className='flex flex-row space-x-4'>
                            <Image alt='gg' src="/images/gg.png" width={50} height={50} />
                            <Image alt='fb' src="/images/fb.png" width={50} height={50} />
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
