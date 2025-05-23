import React from 'react';
import { Link } from '@inertiajs/react';

const Button = ({ children, variant = 'outline', href, ...props }) => {
    const base = 'text-sm rounded-lg px-3 py-2 lg:px-5 lg:py-2 hover:scale-105 transition-all cursor-pointer';
    const outline = 'border-2 border-cust-primary-color text-cust-primary-color font-semibold';
    const filled = 'bg-cust-primary-color border-2 border-cust-primary-color text-white font-semibold';
    const secondary = 'border border-gray-400 text-black font-base';

    const classes = `${base} ${variant === 'filled' ? filled
            : variant === 'secondary' ? secondary
            : outline
        }`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;