import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function NavBar({ setJournalData }) {
    const navigate = useNavigate();
    function trust(route) {
        navigate(route);
    }
    return (
        <div className="flex items-center px-4 py-3 bg-gray-900 shadow-lg border-b border-teal-900/50">
            <div className="flex gap-2 mr-4">
                <button
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-300 rounded-lg group bg-gradient-to-br from-teal-700 to-teal-900 group-hover:from-teal-700 group-hover:to-teal-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-teal-500/50"
                    onClick={() => trust(-1)}
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800/90 rounded-md group-hover:bg-opacity-0">
                        Back
                    </span>
                </button>
                <button
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-300 rounded-lg group bg-gradient-to-br from-teal-700 to-teal-900 group-hover:from-teal-700 group-hover:to-teal-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-teal-500/50"
                    onClick={() => trust("/")}
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-800/90 rounded-md group-hover:bg-opacity-0">
                        Upload
                    </span>
                </button>
            </div>
            <SearchBar setJournalData={setJournalData} />
        </div>
    );
}

export default NavBar;