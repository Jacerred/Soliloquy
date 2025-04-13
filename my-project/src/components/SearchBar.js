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
                {/* Memory Search Icon */}
                <div className="absolute -left-10 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </div>
                
                {/* Unified Search Container with Gradient Border */}
                <div className="relative p-0.5 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex shadow-lg">
                    {/* Dropdown Button */}
                    <button
                        className="flex items-center justify-center h-full rounded-l-md bg-white dark:bg-gray-900 group-hover:bg-opacity-0 transition-all duration-75 ease-in"
                        onClick={toggleDropdown}
                        disabled={isLoading}
                    >
                        <span className={`px-4 py-2 text-sm font-medium ${isLoading ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {selected} <span className="ml-1">▼</span>
                        </span>
                    </button>
                    
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search your memories..."
                        className={`w-64 px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-none focus:ring-0 focus:outline-none ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    />
                    
                    {/* Search Button */}
                    <button
                        className={`flex items-center justify-center rounded-r-md bg-white dark:bg-gray-900 transition-all duration-75 ease-in px-4 py-2 text-sm font-medium 
                        ${isLoading ? 'cursor-not-allowed text-gray-500 dark:text-gray-400' : 'hover:bg-opacity-0 hover:text-white text-gray-900 dark:text-white'}`}
                        onClick={handleSubmit}
                        disabled={isLoading || !searchText.trim()}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <LoadingSpinner />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </div>
                        )}
                    </button>
                </div>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && !isLoading && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-indigo-500/20">
                        <ul className="py-1">
                            <li 
                                className="px-4 py-3 hover:bg-indigo-600/40 cursor-pointer text-sm text-cyan-100 flex items-center"
                                onClick={() => handleSelectOption("Find Day")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Search in Today's Journal
                            </li>
                            <li 
                                className="px-4 py-3 hover:bg-indigo-600/40 cursor-pointer text-sm text-cyan-100 flex items-center"
                                onClick={() => handleSelectOption("Find All")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Search in All Journals
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            
            {result && <div className="ml-2 text-sm text-red-400">{result}</div>}
        </div>
    );
}

export default SearchBar;