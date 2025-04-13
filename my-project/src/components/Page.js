import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Page({ title, text, fileName=null, setJournalData }) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (fileName) {
            // async function to get the video
            async function getVideo() {
                try {
                    setLoading(true);
                    const result = await window.electronAPI.getVideo(fileName);
                    const byteCharacters = atob(result.data);
                    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: result.type });
                    const url = URL.createObjectURL(blob);
                    setVideoSrc(url);
                } catch (error) {
                    console.error("Error loading video:", error);
                } finally {
                    setLoading(false);
                }
            }
            getVideo();
            
            // Cleanup URL when component unmounts
            return () => {
                if (videoSrc) {
                    URL.revokeObjectURL(videoSrc);
                }
            };
        }
    }, [fileName]);
    
    const openVideoModal = () => {
        setShowVideoModal(true);
    };
    
    const closeVideoModal = () => {
        setShowVideoModal(false);
    };
    
    // Function to handle date click and load journal for that date
    const handleDateClick = (date) => {
        // Format date as YYYY-MM-DD for API request
        const formData = new FormData();
        formData.append('date', date);
        
        // Make POST request to backend
        fetch('http://localhost:8000/api/getJournal', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // Use the setJournalData prop to update the state in App.js
                if (setJournalData) {
                    setJournalData({
                        title: date,
                        text: data.response,
                        fileName: data.filepath
                    });
                    
                    // Navigate to journal route
                    navigate('/journal');
                } else {
                    console.error('setJournalData prop is not available');
                }
            })
            .catch(error => {
                console.error('Error fetching journal:', error);
            });
    };
    
    // Function to transform text and convert dates to clickable links
    const renderTextWithDateLinks = (text) => {
        if (!text) return "";
        
        // Regular expression to find dates in the format YYYY-MM-DD
        const dateRegex = /\b(\d{4}-\d{2}-\d{2})\b/g;
        
        // Split text by date matches
        const parts = text.split(dateRegex);
        
        // If no dates found, return original text
        if (parts.length <= 1) return text;
        
        // Build result with clickable dates
        const result = [];
        for (let i = 0; i < parts.length; i++) {
            // Add text part
            result.push(parts[i]);
            
            // If there's a date after this part, add it as a link
            if (i < parts.length - 1 && dateRegex.test(parts[i+1])) {
                const date = parts[i+1];
                i++; // Skip the date part in the next iteration
                
                result.push(
                    <a 
                        key={`date-${i}`}
                        href={`/journal/${date}`} 
                        className="text-cyan-400 hover:text-cyan-300 underline"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDateClick(date);
                        }}
                    >
                        {date}
                    </a>
                );
            }
        }
        
        return result;
    };
    
    return (
        <div className="h-full flex flex-col">
            {/* Title section on top */}
            <div className="flex items-center mb-6 pb-3 border-b border-indigo-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h1 className="text-2xl md:text-3xl font-semibold text-cyan-100">{title}</h1>
            </div>
            
            {/* Video button in the middle */}
            {fileName && (
                <div className="mb-6 flex justify-center">
                    {loading ? (
                        <div className="w-full h-48 flex items-center justify-center bg-indigo-900/20 rounded-md">
                            <p className="text-cyan-100">Loading video...</p>
                        </div>
                    ) : (
                        videoSrc && (
                            <button 
                                onClick={openVideoModal}
                                className="bg-indigo-900/40 hover:bg-indigo-800/60 p-3 rounded-lg border border-indigo-500/30 transition duration-200 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-cyan-100">Watch Memory Video</span>
                            </button>
                        )
                    )}
                </div>
            )}
            
            {/* Text content at the bottom */}
            <div className="prose prose-invert max-w-none flex-grow overflow-auto pr-2 custom-scrollbar">
                <div className="bg-indigo-900/20 p-5 rounded-lg border border-indigo-500/20 backdrop-blur-sm shadow-inner">
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                        {renderTextWithDateLinks(text)}
                    </p>
                </div>
            </div>
            
            {/* Video Modal */}
            {showVideoModal && videoSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity" onClick={closeVideoModal}>
                    <div className="relative max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-gray-800/90 rounded-lg shadow-2xl border border-indigo-500/30 p-1">
                            <div className="flex justify-end p-2">
                                <button 
                                    onClick={closeVideoModal}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-2">
                                <video controls className="w-full rounded-md" src={videoSrc} autoPlay />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
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

export default Page;