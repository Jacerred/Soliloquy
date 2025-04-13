import "../index.css";
import { useState, useEffect } from "react";

function Upload() {
    const [filePath, setFilePath] = useState(null);
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isFileJustUploaded, setIsFileJustUploaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let timeoutId;
        if (file) {
            setIsFileJustUploaded(true);
            timeoutId = setTimeout(() => {
                setFile(null);
                setFilePath(null);
                setIsFileJustUploaded(false);
            }, 3000); // Reset after 3 seconds
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [file]);

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    function VideoPicker() {
        const handleSelect = async () => {
            const selectedPath = await window.electronAPI.selectVideo();
            if (selectedPath) {
                console.log('Selected file:', selectedPath);
                setFilePath(selectedPath);
                setFile(selectedPath); // Using path as file for visual indication
            } else {
                console.log('No file selected');
            }
        };

        function handleFileChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setFile(selectedFile);
            }
        }

        function handleDragOver(event) {
            event.preventDefault();
            setIsDragOver(true);
        }

        function handleDragLeave(event) {
            event.preventDefault();
            setIsDragOver(false);
        }

        function handleDrop(event) {
            event.preventDefault();
            const droppedFile = event.dataTransfer.files[0];
            if (droppedFile) {
                setFile(droppedFile);
            }
            setIsDragOver(false);
        }

        return (
            <div>
                <div className="mt-10 mr-40 ml-40">
                    <div
                        className="flex items-center justify-center w-full"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <label
                            style={{width: "90vh", height: "40vh"}}
                            htmlFor="dropzone-file"
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-500 ease-in-out
                                ${isDragOver ? 'bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}
                                ${file ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500'}`}
                        >
                            <div className={`flex flex-col items-center justify-center pt-5 pb-6 transition-all duration-500 ease-in-out`}>
                                {file ? (
                                    <>
                                        <svg className="w-8 h-8 mb-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="mb-2 text-sm text-green-600 dark:text-green-400">
                                            <span className="font-semibold">File selected:</span> {file.name || 'Selected via dialog'}
                                        </p>
                                        <p className="text-xs text-green-500 dark:text-green-400">Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                                    </>
                                )}
                            </div>
                            <button
                                id="dropzone-file"
                                type="button"
                                className="hidden"
                                onClick={handleSelect}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        type="submit"
                        className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 ${ 
                            !file || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!file || isSubmitting}
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <LoadingSpinner />
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                "Upload"
                            )}
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        
        // Set submitting state
        setIsSubmitting(true);
        
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        formData.append("filename", filePath);

        // handle as json (for debugging)
        //const formJson = Object.fromEntries(formData.entries());
        //console.log(formJson);

        // You can pass formData as a fetch body directly:
        fetch('http://127.0.0.1:8000/api/processVideo', { 
            method: form.method, 
            body: formData 
        })
        .then(response => {
            // Reset submitting state when complete (successful or not)
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1000); // Add a slight delay for better UX
        })
        .catch(error => {
            console.error('Error uploading:', error);
            setIsSubmitting(false);
        });
    }
    
    return (
        <div className="flex justify-center items-center h-screen">
            <form method="post" onSubmit={handleSubmit}>
                <VideoPicker />
            </form>
        </div>
    );
}
export default Upload;