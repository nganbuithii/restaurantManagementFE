
import React from 'react';

const InputField = ({ icon, register, name, placeholder, type = "text", error, validation = { required: `${name} is required` } }) => (
    <div className="mb-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                {...register(name, validation)}
                type={type}
                placeholder={placeholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-300"
            />
        </div>
        {error && <p className="mt-1 text-xs text-red-500 pl-3">{error.message}</p>}
    </div>
);

export default InputField;
