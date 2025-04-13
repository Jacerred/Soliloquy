function Page({ title, text }) {
    return (
        <div className="mt-10 mr-40 ml-40 items-center justify-center w-full h-full">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white">{title}</h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">{text}</p>
        </div>
    );
}

export default Page;