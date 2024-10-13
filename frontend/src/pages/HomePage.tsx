import ProductCard from "@/components/elements/ProductCard"

const HomePage = () => {
    return (
        <>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your GPUS!
                        </p>
                    </div>
                </div>
                <div className="border border-solid border-red-500 flex flex-wrap justify-center gap-5">
                    {[1, 2, 3, 4, 5, 6].map(item => <ProductCard key={item} />)}
                </div>
            </div>
        </>
    )
}

export default HomePage