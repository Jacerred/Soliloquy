function Page({ title, text }) {
    return (
        <div className="h-full">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-700">{title}</h1>
            <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line">{text}</p>
            </div>
        </div>
    );
}

export default Page;