import React from "react";

const Input = ({
    label,
    placeholder,
    description,
    value,
    type = "text",
    required = false,
}) => {
    return (
        <div className="flex flex-col justify-start items-start gap-2 w-full">
            {label && (
                <div className="flex flex-row text-lg font-bold w-full">
                    <div className="text-black">{label}</div>
                    {required && <div className="text-red-500">{" "} *</div>}
                </div>
            )}
            <input
                className="flex outline-none rounded-lg px-5 py-3 border-[1px] border-cust-gray w-full"
                placeholder={placeholder}
                value={value}
                type={type}
                required={required}
            />
            {description && (
                <div className="w-full text-base text-cust-gray font-normal">
                    {description}
                </div>
            )}
        </div>
    );
};

export default Input;
