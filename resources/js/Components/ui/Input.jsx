import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
    label,
    placeholder,
    description,
    value,
    type = "text",
    isPassword = false,
    isSocialMedia = false,
    required = false,
    icon,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col justify-start items-start gap-2 w-full">
            {label && (
                <div className="flex flex-row text-lg font-bold w-full">
                    <div className="text-black">{label}</div>
                    {required && <div className="text-red-500"> *</div>}
                </div>
            )}
            {isPassword ? (
                <div className="relative w-full">
                    <input
                        className="flex outline-none rounded-lg px-5 py-3 border-[1px] border-cust-gray w-full"
                        placeholder={placeholder}
                        value={value}
                        type={showPassword ? "text" : "password"}
                        required={required}
                        {...props}
                    />
                    <button
                        className="absolute -translate-x-full right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={togglePassword}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
            ) : isSocialMedia ? (
                <div className="flex flex-row justify-start items-center w-full gap-5">
                    <div className="">{icon}</div>
                    <input
                        className="flex outline-none rounded-lg px-5 py-3 border-[1px] border-cust-gray w-full"
                        placeholder={placeholder}
                        value={value}
                        type={"text"}
                        required={required}
                        {...props}
                    />
                </div>
            ) : (
                <input
                    className="flex outline-none rounded-lg px-5 py-3 border-[1px] border-cust-gray w-full"
                    placeholder={placeholder}
                    value={value}
                    type={type}
                    required={required}
                    {...props}
                />
            )}
            {description && (
                <div className="w-full text-base text-cust-gray font-normal">
                    {description}
                </div>
            )}
        </div>
    );
};

export default Input;
