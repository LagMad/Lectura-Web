import React from 'react';

const Button = ({ children, variant = 'outline', ...props }) => {
    const base = 'font-semibold text-sm rounded-lg px-3 py-2 lg:px-5 lg:py-2 hover:scale-105 transition-all cursor-pointer';
    const outline = 'border-2 border-cust-primary-color text-cust-primary-color cursor-pointer';
    const filled = 'bg-cust-primary-color border-2 border-cust-primary-color text-white cursor-pointer';

    const classes = `${base} ${variant === 'filled' ? filled : outline}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
