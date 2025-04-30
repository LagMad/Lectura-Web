import React from "react";

const Button = ({ className, onClick, children }) => {
    return (
        <button
            className={`${className} flex px-10 py-1.5 rounded-lg bg-cust-blue text-white font-bold cursor-pointer`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
