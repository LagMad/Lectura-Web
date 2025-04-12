import React from "react";

const Button = ({ className, onClick, children }) => {
    return (
        <button
            className={`${className} flex px-4 py-2 rounded-md bg-cust-blue text-white font-normal cursor-pointer`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
