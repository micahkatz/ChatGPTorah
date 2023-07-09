import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = (props: Props) => {
    return (
        <input
            {...props}
            className={`border-solid border-2 border-purple-400 rounded-md px-2 py-1 ${props?.className || ''}`}
        />
    )
}

export default Input