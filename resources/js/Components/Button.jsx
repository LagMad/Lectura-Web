import React from 'react';

const Button = ({ children, variant = 'outline', ...props }) => {
    const base = 'font-semibold text-sm rounded-lg px-5 py-2 hover:scale-105 transition-all';
    const outline = 'border-2 border-cust-primary-color text-cust-primary-color';
    const filled = 'bg-cust-primary-color border-2 border-cust-primary-color text-white';

    const classes = `${base} ${variant === 'filled' ? filled : outline}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
