import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function NavBar({ setJournalData }) {
    const navigate = useNavigate();
    function trust(route) {
        navigate(route);
    }
    return (
        <div className="flex items-center px-6 py-4 bg-slate-800/70 backdrop-blur-sm shadow-lg border-b border-indigo-500/10">
            <div className="flex items-center">
                <div className="mr-6">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                        Soliloquy
                    </h1>
                    <span className="text-xs text-indigo-300">Your smart glasses memory journal</span>
                </div>
                <div className="flex gap-3">
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-600 hover:text-white focus:ring-2 focus:outline-none focus:ring-indigo-400"
                        onClick={() => trust(-1)}
                    >
                        <span className="relative px-4 py-2 transition-all ease-in duration-100 bg-slate-900 rounded-md group-hover:bg-opacity-0">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                                </svg>
                                Back
                            </span>
                        </span>
                    </button>
                    <button
                        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-600 hover:text-white focus:ring-2 focus:outline-none focus:ring-indigo-400"
                        onClick={() => trust("/")}
                    >
                        <span className="relative px-4 py-2 transition-all ease-in duration-100 bg-slate-900 rounded-md group-hover:bg-opacity-0">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                Upload Memory
                            </span>
                        </span>
                    </button>
                </div>
            </div>
            <SearchBar setJournalData={setJournalData} />
        </div>
    );
}

export default NavBar;