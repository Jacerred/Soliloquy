import { useState, useEffect } from "react";

function Page({ title, text, fileName=null }) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    
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
    
    return (
        <div className="h-full flex flex-col">
            {fileName && (
                loading ? (
                    <div className="w-full h-48 flex items-center justify-center bg-indigo-900/20 rounded-md">
                        <p className="text-cyan-100">Loading video...</p>
                    </div>
                ) : (
                    videoSrc && <video controls className="w-full" src={videoSrc} />
                )
            )}
            <div className="flex items-center mb-6 pb-3 border-b border-indigo-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h1 className="text-2xl md:text-3xl font-semibold text-cyan-100">{title}</h1>
            </div>
            
            <div className="prose prose-invert max-w-none flex-grow overflow-auto pr-2 custom-scrollbar">
                <div className="bg-indigo-900/20 p-5 rounded-lg border border-indigo-500/20 backdrop-blur-sm shadow-inner">
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed">{text}</p>
                </div>
            </div>

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