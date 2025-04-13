import 'flowbite';
import '../index.css';
import { Dropdown, DropdownItem, TextInput, Button } from "flowbite-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ setJournalData }) {
    const [selected, setSelected] = useState('Find All');
    const [result, setResult] = useState('');
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    
    // This function handles the form submission.
    function handleSubmit(e) {
        if (e) e.preventDefault();

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
            });
    }

    return (
        <>
            <Dropdown label={selected} dismissOnClick={false}>
                <DropdownItem onClick={() => setSelected("Find Day")}>Search in Today's Journal</DropdownItem>
                <DropdownItem onClick={() => setSelected("Find All")}>Search in All Journals</DropdownItem>
            </Dropdown>
            <TextInput 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <Button onClick={handleSubmit}>Search</Button>
            {result && <div className="mt-4">{result}</div>}
        </>
    );
}

export default SearchBar;