import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JournalDatesList({ setJournalData }) {
    const [dates, setDates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch dates from the API
        fetch('http://localhost:8000/api/getDates')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.dates) {
                    // Sort dates in descending order (newest first)
                    const sortedDates = [...data.dates].sort((a, b) => 
                        new Date(b) - new Date(a)
                    );
                    setDates(sortedDates);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching dates:', error);
                setError('Failed to load journal dates');
                setIsLoading(false);
            });
    }, []);

    const handleDateClick = (date) => {
        // Create form data
        const formData = new FormData();
        formData.append('date', date);
        
        // Make POST request to backend
        fetch('http://localhost:8000/api/getJournal', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // Save journal data and navigate to journal page
                setJournalData({
                    title: date,
                    text: data.response,
                    fileName: data.filepath
                });
                navigate('/journal');
            })
            .catch(error => {
                console.error('Error fetching journal:', error);
            });
    };

    if (error) {
        return <div className="text-red-400 text-sm mt-4">{error}</div>;
    }

    return (
        <div className="mt-5">
            <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-sm font-medium text-cyan-100">Recent Journals</h3>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center py-4">
                    <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : dates.length === 0 ? (
                <p className="text-xs text-indigo-300 text-center py-2">No journal entries found</p>
            ) : (
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-1">
                        {dates.map((date, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleDateClick(date)}
                                    className="w-full text-left px-3 py-2 text-xs rounded-md text-cyan-100 hover:bg-indigo-600/40 transition duration-150 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {date}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(79, 70, 229, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.5);
                }
            `}</style>
        </div>
    );
}

export default JournalDatesList; 