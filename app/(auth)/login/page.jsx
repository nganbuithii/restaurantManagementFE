"use client";

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Image from 'next/image';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import API, { authApi, endpoints } from '../../configs/API';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    // State for forgot password modal
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const toggleShowPassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const onSubmit = async (data) => {
        try {
            const response = await API.post(endpoints.login, {
                username: data.username,
                password: data.password
            });    
            localStorage.setItem('token', response.data.data.accessToken);
    
            const userResponse = await authApi(response.data.data.accessToken).get(endpoints.currentUser);
            console.log(userResponse.data)
    
            dispatch(loginSuccess({
                user: userResponse.data.data,
                token: response.data.data.accessToken
            }));
    
            const previousPage = localStorage.getItem('previousPage');
            localStorage.removeItem('previousPage'); 

            if (previousPage === '/booking') {
                router.push('/booking');
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const handleForgotPassword = async () => {
        if (forgotPasswordStep === 1) {
            // Send email for OTP
            try {
                await API.post(endpoints.forgetPassword, { email });
                setForgotPasswordStep(2);
                toast.success('OTP sent to your email');
            } catch (error) {
                toast.error('Failed to send OTP');
            }
        } else {
            // Verify OTP and reset password
            try {
                await API.post(endpoints.resetPassword, { email, otp, newPassword });
                toast.success('Password reset successfully');
                setIsForgotPasswordOpen(false);
                setForgotPasswordStep(1);
            } catch (error) {
                toast.error('Failed to reset password');
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 relative">
                <Image
                    src="/images/login.png"
                    alt="Login Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                />
            </div>
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" method="post">
                    <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">LOGIN</h2>

                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <FaUser color="gray" size={20} />
                        </span>
                        <input
                            {...register('username', {
                                required: 'Username không được để trống',
                                minLength: {
                                    value: 4,
                                    message: 'Username phải có ít nhất 4 ký tự'
                                }
                            })}
                            placeholder="Username"
                            className="border border-gray-300 pl-10 pr-3 py-2 w-full rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <FaLock color="gray" size={20} />
                        </span>
                        <input
                            {...register('password', {
                                required: 'Mật khẩu không được để trống',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                }
                            })}
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
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <p className="text-sm text-gray-600 mt-4 text-right font-bold">
                        <button 
                            type="button" 
                            onClick={() => setIsForgotPasswordOpen(true)} 
                            className="text-orange-700 hover:text-red-700 transition duration-200"
                        >
                            Forgot password?
                        </button>
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
            <ToastContainer />

            <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{forgotPasswordStep === 1 ? 'Forgot Password' : 'Reset Password'}</DialogTitle>
                    </DialogHeader>
                    {forgotPasswordStep === 1 && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <FaEnvelope className="text-gray-400" />
                                <Input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>
                    )}
                    {forgotPasswordStep === 2 && (
                        <div className="space-y-4">
                            <Input 
                                type="text" 
                                placeholder="Enter OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                            />
                            <Input 
                                type="password" 
                                placeholder="Enter new password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                            />
                        </div>
                    )}
                    <DialogFooter>
                    <Button 
                            onClick={handleForgotPassword}
                            className="bg-gradient-to-r from-orange-400 to-orange-500 
                                    hover:from-orange-500 hover:to-orange-600 
                                    text-white font-semibold py-2 px-4 rounded-md 
                                    shadow-md transition duration-300 ease-in-out 
                                    transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            {forgotPasswordStep === 1 ? 'Send OTP' : 'Reset Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}