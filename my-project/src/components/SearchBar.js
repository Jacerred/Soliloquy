import 'flowbite';
import '../index.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ setJournalData }) {
    const [selected, setSelected] = useState('Find All');
    const [result, setResult] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    // This function handles the form submission.
    function handleSubmit(e) {
        if (e) e.preventDefault();
        
        // Don't submit if already loading or if no search text
        if (isLoading || !searchText.trim()) return;
        
        // Set loading state
        setIsLoading(true);
        setResult('');

        // Create a new FormData object and append the search text
        const formData = new FormData();
        formData.append("prompt", searchText);

        // Determine the endpoint based on the dropdown selection
        const endpoint = selected === "Find Day" 
            ? "http://localhost:8000/api/queryVideo" 
            : "http://localhost:8000/api/queryJournal";

        // Use fetch to send the form data to the chosen endpoint
        fetch(endpoint, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Server response:", data);
                // Only display the string under the "response" key
                if (data && data.response) {
                    // Update the parent App component with search results
                    // Similar to how the calendar works
                    setJournalData({
                        title: `Search: ${searchText}`,
                        text: data.response
                    });
                    
                    // Navigate to the journal page
                    navigate('/journal');
                } else {
                    setResult("No response found.");
                }
            })
            .catch((error) => {
                console.error("Error submitting prompt:", error);
                setResult("Error fetching result.");
            })
            .finally(() => {
                // Reset loading state
                setIsLoading(false);
            });
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    // Add click outside listener
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectOption = (option) => {
        setSelected(option);
        setIsDropdownOpen(false);
    };

    // Spinner component for loading state
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <div className="flex items-center ml-auto">
            <div className="relative flex" ref={dropdownRef}>
                {/* Unified Search Container with Gradient Border */}
                <div className="relative p-0.5 rounded-lg bg-gradient-to-br from-teal-700 to-teal-900 flex">
                    {/* Dropdown Button */}
                    <button
                        className="flex items-center justify-center h-full rounded-l-md bg-gray-800/90 group-hover:bg-opacity-0 transition-all duration-75 ease-in"
                        onClick={toggleDropdown}
                        disabled={isLoading}
                    >
                        <span className={`px-4 py-2 text-sm font-medium ${isLoading ? 'text-gray-500' : 'text-gray-300'}`}>
                            {selected} <span className="ml-1">▼</span>
                        </span>
                    </button>
                    
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search memories..."
                        className={`w-64 px-3 py-2 text-sm text-gray-200 bg-gray-800/90 border-none focus:ring-0 focus:outline-none placeholder-gray-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    />
                    
                    {/* Search Button */}
                    <button
                        className={`flex items-center justify-center rounded-r-md bg-gray-800/90 transition-all duration-75 ease-in px-4 py-2 text-sm font-medium 
                        ${isLoading ? 'cursor-not-allowed text-gray-500' : 'hover:bg-opacity-0 hover:text-white text-gray-300'}`}
                        onClick={handleSubmit}
                        disabled={isLoading || !searchText.trim()}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <LoadingSpinner />
                                <span className="text-gray-400">Searching...</span>
                            </div>
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && !isLoading && (
                    <div className="absolute z-10 top-full left-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-teal-900/50">
                        <ul className="py-1">
                            <li 
                                className="px-4 py-2 hover:bg-teal-700/50 cursor-pointer text-sm text-gray-300"
                                onClick={() => handleSelectOption("Find Day")}
                            >
                                Today's Memories
                            </li>
                            <li 
                                className="px-4 py-2 hover:bg-teal-700/50 cursor-pointer text-sm text-gray-300"
                                onClick={() => handleSelectOption("Find All")}
                            >
                                All Memories
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            
            {result && <div className="ml-2 text-sm text-red-500">{result}</div>}
        </div>
    );
}

export default SearchBar;