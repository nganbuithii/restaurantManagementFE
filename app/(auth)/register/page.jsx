'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserCircle } from 'react-icons/fa';
import API, { endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '@/components/InputField'

export default function Register() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const res = await API.post(endpoints.register, {
                username: data.username,
                password: data.password,
                email: data.email,
                phone: data.phone,
                fullName: data.fullName
            });
            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 3000); 
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Registration failed. Please try again.');
            }
        }
    };

    const password = watch('password');

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-red-100" style={{ backgroundImage: 'url("/images/register.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white bg-opacity-90 shadow-2xl rounded-3xl px-8 pt-8 pb-8 mb-4 backdrop-blur-sm">
                    <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-8">Create Your Account</h2>

                    <div className="space-y-6">
                        <InputField
                            icon={<FaUserCircle className="text-orange-400" />}
                            register={register}
                            name="fullName"
                            placeholder="Full Name"
                            error={errors.fullName}
                        />

                        <InputField
                            icon={<FaEnvelope className="text-orange-400" />}
                            register={register}
                            name="email"
                            placeholder="Email"
                            error={errors.email}
                            validation={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            }}
                        />

                        <InputField
                            icon={<FaUser className="text-orange-400" />}
                            register={register}
                            name="username"
                            placeholder="Username"
                            error={errors.username}
                        />

                        <InputField
                            icon={<FaPhone className="text-orange-400" />}
                            register={register}
                            name="phone"
                            placeholder="Phone Number"
                            error={errors.phone}
                            validation={{
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10,11}$/,
                                    message: "Invalid phone number"
                                }
                            }}
                        />

                        <InputField
                            icon={<FaLock className="text-orange-400" />}
                            register={register}
                            name="password"
                            placeholder="Password"
                            type="password"
                            error={errors.password}
                            validation={{
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                }
                            }}
                        />

                        <InputField
                            icon={<FaLock className="text-orange-400" />}
                            register={register}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            type="password"
                            error={errors.confirmPassword}
                            validation={{
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                            }}
                        />
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}

                    <button
                        type="submit"
                        className="w-full mt-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-full shadow-lg hover:from-orange-500 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition duration-300 transform hover:scale-105"
                    >
                        Create Account
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}