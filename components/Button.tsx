import React, { ButtonHTMLAttributes } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const Button = (props: Props) => {
    return (
        <button
            {...props}
            className={`bg-purple-400 px-4 py-2 rounded-md text-white hover:bg-purple-600 flex items-center justify-center ${props?.className || ''}`}
        />
    )
}

export default Button