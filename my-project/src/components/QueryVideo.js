import React, { useState } from "react";
import "../index.css";

function QueryVideo() {
  const [result, setResult] = useState("");

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
      dropdownValue === "Today" ? "/api/queryVideo" : "/api/queryJournal";

    // Use fetch to send the form data (only the prompt) to the chosen endpoint.
    fetch(endpoint, {
      method: e.target.method, // typically "post"
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
        // Format the result as a pretty JSON string.
        setResult(JSON.stringify(data, null, 2));
      })
      .catch((error) => {
        console.error("Error submitting prompt:", error);
        setResult("Error fetching result.");
      });
  }

  return (
    <div className="mt-10 mr-40 ml-40">
      <form method="post" onSubmit={handleSubmit}>
        {/* Prompt input row */}
        <div className="flex items-center">
          {/* Prompt textarea */}
          <label htmlFor="prompt-input" className="sr-only">
            Prompt
          </label>
          <textarea
            id="prompt-input"
            name="prompt"
            placeholder="Enter your prompt here..."
            className="w-[600px] h-28 p-2 border border-gray-300 rounded resize-y overflow-auto"
          ></textarea>

          {/* Submit button on the right */}
          <button
            type="submit"
            className="px-4 py-2 ml-4 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Submit
          </button>
        </div>

        {/* Dropdown and title arranged horizontally, with title on the left */}
        <div className="mt-4 flex justify-center items-center">
          <label htmlFor="dateOption" className="mr-2">
            Select Date Option:
          </label>
          <select
            id="dateOption"
            name="dateOption"
            className="p-2 border border-gray-300 rounded"
          >
            <option value="Today">Today</option>
            <option value="All Dates">All Dates</option>
          </select>
        </div>

        {/* Result textbox below the date selection area */}
        <div className="mt-4">
          <textarea
            id="result-output"
            value={result}
            readOnly
            placeholder="Result logs will appear here..."
            className="w-full h-64 p-2 border border-gray-300 rounded resize-y overflow-auto"
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default QueryVideo;