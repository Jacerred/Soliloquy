import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function NavBar({ setJournalData }) {
    const navigate = useNavigate();
    function trust(route) {
        navigate(route);
    }
    return (
        <div className="relative z-20 flex items-center px-6 py-4 bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-indigo-500/20">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <h1 className="text-xl font-bold text-cyan-100">Soliloquy</h1>
            </div>
            
            <div className="flex gap-3 ml-8">
                <button
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800"
                    onClick={() => trust(-1)}
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            Back
                        </div>
                    </span>
                </button>
                <button
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800"
                    onClick={() => trust("/")}
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Upload
                        </div>
                    </span>
                </button>
            </div>
            
            <SearchBar setJournalData={setJournalData} />
        </div>
    );
}

export default NavBar;