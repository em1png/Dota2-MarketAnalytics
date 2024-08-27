import React from "react"

interface IStatFrame {
    title: string,
    value: string | React.ReactNode,
    desc: string,
    className: string
};

const StatFrame = ({ title, value, desc, className = 'rounded-md' } : IStatFrame) => {
    return (
        <div className={`flex flex-col justify-center ${className}`}>
            <h3 className="tracking-tight text-xs text-neutral-500">{title}</h3>
            <div className="">
                <div className="text-3xl font-bold my-1">
                    {value}
                </div>
                <p className="text-[10px] text-neutral-500">
                    {desc}
                </p>
            </div>
        </div>
    )
}

export default StatFrame