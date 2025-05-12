import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.name === 'password' || type === 'password';

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <input
                {...props}
                type={isPassword && showPassword ? 'text' : isPassword ? 'password' : type}
                className={
                    'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                    (isPassword ? 'pr-10 ' : '') +
                    className
                }
                ref={localRef}
            />
            {isPassword && (
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                >
                    <Icon 
                        icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                        className="h-5 w-5" 
                        aria-hidden="true" 
                    />
                </button>
            )}
        </div>
    );
});