const StatFrame = ({ title, value, desc, className = 'rounded-md' }) => {
    return (
        <div className={`flex flex-col justify-center ${className}`}>
            <h3 className="tracking-tight text-xs text-neutral-300">{title}</h3>
            <div className="">
                <div className="text-3xl font-bold my-1">
                    {value}
                </div>
                <p className="text-[10px] text-muted-foreground">
                    {desc}
                </p>
            </div>
        </div>
    )
}

export default StatFrame