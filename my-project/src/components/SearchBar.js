import 'flowbite';
import '../index.css';
import { Dropdown, DropdownItem, TextInput, Button } from "flowbite-react";
import { useState } from 'react';


function SearchBar() {
    const [selected, setSelected] = useState('All text');
    
    // This function handles the form submission.
    function handleSubmit(e) {
    e.preventDefault();

    // Extract the prompt value only.
    const promptValue = e.target.elements.prompt.value;

    // Create a new FormData object and append only the prompt.
    const formData = new FormData();
    formData.append("prompt", promptValue);

    // Retrieve the dropdown selection value (for endpoint selection only).
    const dropdownValue = e.target.elements.dateOption.value;

    // Determine the endpoint based on the dropdown selection.
    const endpoint =
        dropdownValue === "Today" ? "http://localhost:8000/api/queryVideo" : "http://localhost:8000/api/queryJournal";

    // Use fetch to send the form data (only the prompt) to the chosen endpoint.
    fetch(endpoint, {
        method: e.target.method, // typically "post"
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
        console.log("Server response:", data);
        // Only display the string under the "response" key.
        if (data && data.response) {
            setResult(data.response);
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
                <DropdownItem onClick={() => setSelected("Find Day")}>Find Day</DropdownItem>
                <DropdownItem onClick={() => setSelected("Find Time")}>Find Time</DropdownItem>
            </Dropdown>
            <TextInput/>
            <Button>Search</Button>
        </>
    );
}

export default SearchBar;