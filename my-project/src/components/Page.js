function Page({ title, text }) {

    const PuzzleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-teal-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5A1.5 1.5 0 0111.5 5v1.5a1.5 1.5 0 001.5 1.5h1.5a1.5 1.5 0 010 3H13a1.5 1.5 0 00-1.5 1.5V15a1.5 1.5 0 01-3 0v-2.5A1.5 1.5 0 007 11H5.5a1.5 1.5 0 010-3H7A1.5 1.5 0 008.5 6.5V5A1.5 1.5 0 0110 3.5z" />
            <path fillRule="evenodd" d="M2 6a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H6a4 4 0 01-4-4V6zm4-2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H6z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="h-full overflow-y-auto pr-2">
            <div className="flex items-center mb-1">
                <PuzzleIcon />
                <span className="text-xs uppercase tracking-wider text-teal-500">Reconstructed Memory Fragment:</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-teal-300 mb-4 pb-2 border-b border-teal-900/50">{title}</h1>
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-300">
                <p className="whitespace-pre-line">{text}</p>
            </div>
        </div>
    );
}

export default Page;